import TitleCaseFunction from "../../util/TitleCaseFunction";
import { useEffect, useState } from "react";
import { Card, Table, Button, Tooltip, Input, Spin, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { actionFormLoader } from "../../appRedux/actions/Actions";
import type { SortOrder } from "antd/lib/table/interface";
import type { RootState } from "../../appRedux/store";
import type { SortInfo, ATRSData } from "../../shared/interfaces/ATRS.interface";
import type { ColumnsType } from "antd/lib/table";
import type { TableProps } from "antd/lib/table";
import type { SorterResult } from "antd/lib/table/interface";
import { Link } from "react-router-dom";
import { message } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { deleteATRSAPI, getATRSListAPI } from "../../services/atrs";


const ATRSListing: React.FC = () => {
  // CONSTANTS
  const TOKEN = localStorage.getItem("token");
  const { formLoader } = useSelector(({ common }: RootState) => common);
  const history = useHistory();
  const dispatch = useDispatch();

  const sortedInfo1: SortInfo = {
    columnKey: undefined,
    order: undefined,
  };

  // STATES
  const [atrsList, setATRSList] = useState([])
  const [refresh, toggleRefresh] = useState<boolean>(false);
  const [filteredInfo, setFilteredInfo] = useState<{}>({});
  const [sortedInfo, setSortedInfo] = useState<{ columnKey?: React.Key; order?: SortOrder }>({});
  const [searchedText, setSearchedText] = useState("");
  const [deleteRecordId, setDeleteRecordId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // EFFECTS
  useEffect(() => {
    // Sort the data when the component is first loaded
    const initialSortColumnKey = "id";
    const initialSortOrder: SortOrder = "ascend";
    setSortedInfo({ columnKey: initialSortColumnKey, order: initialSortOrder });
  }, []);

  useEffect(() => {
    renderATRSList();
  }, [refresh]);

  //  HANDLERS
  const renderContent = (value: string, row: ATRSData, index: number) => {
    const obj: { children: string; props: { colSpan?: number } } = {
      children: value,
      props: {},
    };
    if (index === 6) {
      obj.props.colSpan = 0;
    }
    const objecdata = obj.children;
    const data = objecdata?.toString().charAt(0).toUpperCase() + objecdata?.toString().slice(1);
    return data;
  };


  const renderEdit = (editATRS: ATRSData) => {
    clearFunction();
    history.push(`/atrs/updateatrs/${editATRS.id}`);
  };

  const showDeleteConfirm = (id: number) => {
    setDeleteRecordId(id);
    setOpenModal(true);
  };

  const handleOk = async (id: number | null) => {
    setOpenModal(false);
    try {
      if (id !== null) {
        const response = await deleteATRSAPI(id, TOKEN!);
        if (response) {
          if (response.message) {
            toggleRefresh(true);
            message.success(response.message);
          }
          toggleRefresh(false);
        } else {
          message.error("Error");
        }
      }
    } catch (error) {
      console.log(error);
      message.error("Error");
    }
  };


  const handleCancel = () => {
    setOpenModal(false);
  };



  const renderView = (viewatrs: ATRSData) => {
    clearFunction();
    history.push({
      pathname: `/atrs/viewatrs/viewatrs/${viewatrs.id} `,
    });
  };

  const renderATRSList = async () => {
    try {
      dispatch(actionFormLoader(true));
      const response = await getATRSListAPI(TOKEN);
      if (!response) {
        message.error("Error");
      }
      setATRSList(response.atrsList);
      dispatch(actionFormLoader(false));
    } catch (error) {
      console.log(error);
      message.error("Please authenticate with a valid token")
    }
  };

  const handleChange: TableProps<ATRSData>["onChange"] = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    if (sorter && (sorter as SorterResult<ATRSData>).columnKey) {
      setSortedInfo({ columnKey: (sorter as SorterResult<ATRSData>).columnKey, order: (sorter as SorterResult<ATRSData>).order });
    } else {
      setSortedInfo({});
    }
  };

  const clearFunction = () => {
    setATRSList([]);
  };

  const addUser = () => {
    clearFunction();
    history.push("/atrs/addatrs");
  };

  const columns: ColumnsType<ATRSData> = [
    {
      align: "right",
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: renderContent,
      filteredValue: [searchedText],
      onFilter: (value: any, record) => String(record.name).toLowerCase().includes(value.toLowerCase())
        || String(record.id).toLowerCase().includes(value.toLowerCase())
        || String(record.terminal).toLowerCase().includes(value.toLowerCase()),

      sorter: (a, b) => (a.id && b.id ? a.id - b.id : 0),
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : undefined,
    },
    {
      title: "Name",
      key: "name",
      render: (text) => (
        <span className="gx-link" style={{ color: "#545454" }} onClick={() => renderView(text)}>
          <Link to={``}>
            <Tooltip title="View ATRS Details">{TitleCaseFunction(text.name)}</Tooltip>
          </Link>
        </span>
      ),
      onFilter: (value: any, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo1?.columnKey === "name" ? sortedInfo.order : undefined,
    },
    {
      title: "Terminal Name",
      key: "terminal",
      render: (text, record) => (
        <span className="gx-link" style={{ color: "#545454" }}>
          {TitleCaseFunction(String(record.terminal.name))}
        </span>
      ),
      onFilter: (value: any, record) => String(record.terminal.name).toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.terminal.id - b.terminal.id,
      sortOrder: sortedInfo.columnKey === "terminal" ? sortedInfo.order : undefined,
    },
    {
      title: "Airports Name",
      key: "airport",
      render: (text, record) => (
        <span className="gx-link" style={{ color: "#545454" }}>
          {TitleCaseFunction(String(record.terminal.airport.name))}
        </span>
      ),
      onFilter: (value: any, record) => String(record.terminal.airport.name).toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.terminal.airport.id - b.terminal.airport.id,
      sortOrder: sortedInfo.columnKey === "airport" ? sortedInfo.order : undefined,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <span className="gx-link" onClick={() => renderEdit(text)} >
            <i className="icon icon-edit" style={{ fontSize: '18px', marginRight: "25px" }} />
          </span>

          <span className="gx-link" onClick={() => showDeleteConfirm(text.id)}>
            <DeleteOutlined style={{ fontSize: '20px' }} />
          </span>
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      {formLoader === true ? (
        <div className="spinnerLoader">
          <Spin tip="Loading..." size="large"></Spin>
        </div>
      ) : (
        <Card title="ATRS">
          <div
            style={{
              width: "100%",
              float: "right",
              display: "flex",
              position: "absolute",
              top: "10px",
              justifyContent: "flex-end",
              paddingRight: "50px",
            }}
          >
            <div
              style={{
                marginRight: "25px",
                justifyContent: "flex-end",
                width: "100%",
                display: "flex",
              }}
            >
              <Input.Search
                placeholder="Search."
                onSearch={(value) => {
                  setSearchedText(value);
                }}
                onChange={(e) => {
                  setSearchedText(e.target.value);
                }}
                style={{ width: "35%" }}
              />
            </div>
            <Button
              className="button-gradiant"
              onClick={() => addUser()}
              style={{
                fontWeight: "500px",
              }}
            >
              <div> Add ATRS</div>
            </Button>
          </div>

          <Table className="gx-table-responsive" columns={columns} dataSource={atrsList} bordered onChange={handleChange} />
        </Card>
      )}
      <Modal
        title="Are you sure you want to delete this ATRS Machine ?"
        visible={openModal}
        onOk={() => handleOk(deleteRecordId)}
        onCancel={handleCancel}
      >
        {/* Modal content */}
      </Modal>
    </div>
  );
};

export default ATRSListing



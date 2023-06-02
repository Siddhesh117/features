import React from 'react';
import TitleCaseFunction from "../../util/TitleCaseFunction";
import { useEffect, useState } from "react";
import { Card, Table, Button, Tooltip, Input, Spin, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { actionFormLoader } from "../../appRedux/actions/Actions";
import type { SortOrder } from "antd/lib/table/interface";
import type { RootState } from "../../appRedux/store";
import type { SortInfo, TerminalInputData } from "../../shared/interfaces/Terminal.interface";
import type { ColumnsType } from "antd/lib/table";
import type { TableProps } from "antd/lib/table";
import type { SorterResult } from "antd/lib/table/interface";
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteTerminalAPI, getTerminalsListAPI } from '../../services/terminal';
import { message } from "antd";


const TerminalListing: React.FC = () => {
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
    const [terminalsList, setTerminalsList] = useState([])
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
        renderTerminalsList();
    }, [refresh]);

    //  HANDLERS
    const renderContent = (value: string, row: TerminalInputData, index: number) => {
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


    const renderEdit = (editTerminal: TerminalInputData) => {
        clearFunction();
        history.push(`/terminals/updateterminal/${editTerminal.id}`);
    };

    const showDeleteConfirm = (id: number) => {
        setDeleteRecordId(id);
        setOpenModal(true);
    };

    const handleOk = async (id: number | null) => {
        setOpenModal(false);
        try {
            if (id !== null) {
                const response = await deleteTerminalAPI(id, TOKEN!);
                if (response) {
                    if (response.message) {
                        toggleRefresh(true);
                        message.success(response.message);
                    }
                    toggleRefresh(false);
                } else {
                    message.error("Cannot delete terminal. Active ATRS machines exist.");
                }
            }
        } catch (error) {
            console.log(error);
            message.error("Cannot delete terminal. Active ATRS machines exist.");
        }
    };


    const handleCancel = () => {
        setOpenModal(false);
    };




    const renderView = (viewterminal: TerminalInputData) => {
        clearFunction();
        history.push({
            pathname: `/terminals/viewterminal/viewterminal/${viewterminal.id} `,
        });
    };

    const renderTerminalsList = async () => {
        try {
            dispatch(actionFormLoader(true));
            const response = await getTerminalsListAPI(TOKEN);
            if (!response) {
                message.error("Error");
            }
            setTerminalsList(response.terminalList);
            dispatch(actionFormLoader(false));
        } catch (error) {
            message.error("Please authenticate with a valid token")
            console.log(error);
        }
    };

    const handleChange: TableProps<TerminalInputData>["onChange"] = (pagination, filters, sorter) => {
        // console.log("my filters", filters);
        setFilteredInfo(filters);
        if (sorter && (sorter as SorterResult<TerminalInputData>).columnKey) {
            setSortedInfo({ columnKey: (sorter as SorterResult<TerminalInputData>).columnKey, order: (sorter as SorterResult<TerminalInputData>).order });
        } else {
            setSortedInfo({});
        }
    };

    const clearFunction = () => {
        setTerminalsList([]);
    };

    const addUser = () => {
        clearFunction();
        history.push("/terminals/addterminal");
    };

    const columns: ColumnsType<TerminalInputData> = [
        {
            align: "right",
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: renderContent,
            filteredValue: [searchedText],
            onFilter: (value: any, record) => String(record.name).toLowerCase().includes(value.toLowerCase()) || String(record.id).toLowerCase().includes(value.toLowerCase()) || String(record.airport.id).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => (a.id && b.id ? a.id - b.id : 0),
            sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : undefined,
        },
        {
            title: "Terminal Name",
            key: "name",
            render: (text) => (
                <span className="gx-link" style={{ color: "#545454" }} onClick={() => renderView(text)}>
                    <Link to={``}>
                        <Tooltip title="View Terminal Details">{TitleCaseFunction(text.name)}</Tooltip>
                    </Link>
                </span>
            ),
            onFilter: (value: any, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo1?.columnKey === "name" ? sortedInfo.order : undefined,
        },
        {
            title: "Airports Name",
            key: 'airport',
            render: (text, record) => (
                <span className="gx-link" style={{ color: '#545454' }}>
                    {TitleCaseFunction(text.airport.name)}
                </span>
            ),
            onFilter: (value: any, record) => String(record.airport.name).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.airport.id - b.airport.id,
            sortOrder: sortedInfo1?.columnKey === "airport_id" ? sortedInfo.order : undefined,
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <>
                    <span className="gx-link" onClick={() => renderEdit(text)}>
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
                <Card title="Terminals">
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
                            <div> Add Terminal</div>
                        </Button>
                    </div>

                    <Table className="gx-table-responsive" columns={columns} dataSource={terminalsList} bordered onChange={handleChange} />
                </Card>
            )}
            <Modal
                title="Are you sure you want to delete this Terminal ?"
                visible={openModal}
                onOk={() => handleOk(deleteRecordId)}
                onCancel={handleCancel}
            >
                {/* Modal content */}
            </Modal>
        </div>
    );
};

export default TerminalListing

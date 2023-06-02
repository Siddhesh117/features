import React from 'react'
import TitleCaseFunction from "../../util/TitleCaseFunction";
import { useEffect, useState } from "react";
import { Card, Table, Button, Tooltip, Input, Spin, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { actionFormLoader } from "../../appRedux/actions/Actions";
import type { SortOrder } from "antd/lib/table/interface";
import type { RootState } from "../../appRedux/store";
import type { SortInfo, AirportsData, AirportResponse, AirportsDetailsData } from "../../shared/interfaces/Airports.interface";
import type { ColumnsType } from "antd/lib/table";
import type { TableProps } from "antd/lib/table";
import type { SorterResult } from "antd/lib/table/interface";
import { Link } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';
import { deleteAirportAPI, getAirportsListAPI } from '../../services/airport';


const AirportsListing: React.FC = () => {
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
    const [refresh, toggleRefresh] = useState<boolean>(false);
    const [filteredInfo, setFilteredInfo] = useState<{}>({});
    const [sortedInfo, setSortedInfo] = useState<{ columnKey?: React.Key; order?: SortOrder }>({});
    const [searchedText, setSearchedText] = useState("");
    const [airportsList, setAirportsList] = useState<any>([])
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
        renderAirportsList();
    }, [refresh]);




    //  HANDLERS
    const renderContent = (value: string, row: AirportsData, index: number) => {
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


    const renderEdit = (editUser: AirportsData) => {
        clearFunction();
        history.push(`/airports/updateairport/${editUser.id}`);
    };

    const renderView = (viewairport: AirportsData) => {
        clearFunction();
        history.push({
            pathname: `/airports/viewairport/viewairport/${viewairport.id}`,
        });
    };


    const renderAirportsList = async () => {
        try {
            dispatch(actionFormLoader(true));
            const response = await getAirportsListAPI(TOKEN);
            if (!response) {
                message.error("Error");
            }
            setAirportsList(response.airportList);
            dispatch(actionFormLoader(false));
        } catch (error) {
            console.log(error);
            message.error("Please authenticate with a valid token")
        }
    };


    const handleChange: TableProps<AirportsData>["onChange"] = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        if (sorter && (sorter as SorterResult<AirportsData>).columnKey) {
            setSortedInfo({ columnKey: (sorter as SorterResult<AirportsData>).columnKey, order: (sorter as SorterResult<AirportsData>).order });
        } else {
            setSortedInfo({});
        }
    };

    const clearFunction = () => {
        setAirportsList([]);
    };

    const addUser = () => {
        clearFunction();
        history.push("/airports/addairport");
    };
    const showDeleteConfirm = (deleteAirport: AirportsDetailsData) => {
        setDeleteRecordId(deleteAirport.id);
        setOpenModal(true);
    };

    const handleOk = async (id: number | null) => {
        setOpenModal(false);
        try {
            if (id !== null) {
                const response = await deleteAirportAPI(TOKEN, id);
                if (response.message) {
                    toggleRefresh(true);
                    message.success(response.message);
                }
            }
            toggleRefresh(false);
        } catch (error) {
            console.log(error);
            message.error("Cannot delete airport. Active terminals exist");
        }
    };


    const handleCancel = () => {
        setOpenModal(false);
    };



    const columns: ColumnsType<AirportsData> = [
        {
            align: "right",
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: renderContent,
            filteredValue: [searchedText],
            onFilter: (value: any, record) => String(record.name).toLowerCase().includes(value.toLowerCase()) || String(record.id).toLowerCase().includes(value.toLowerCase()) || String(record.location).toLowerCase().includes(value.toLowerCase()) || String(record.city).toLowerCase().includes(value.toLowerCase()) || String(record.state).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => (a.id && b.id ? a.id - b.id : 0),
            sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : undefined,
        },
        {
            title: "Name",
            key: "name",
            render: (text, record) => (
                <span className="gx-link" style={{ color: "#545454" }} onClick={() => renderView(text)}>
                    <Link to={``}>
                        <Tooltip title="View Airport Details">{TitleCaseFunction(text.name)}</Tooltip>
                    </Link>
                </span>
            ),
            onFilter: (value: any, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo1?.columnKey === "name" ? sortedInfo.order : undefined,
        },
        {
            title: "Location",
            key: "location",
            render: (text) => (
                <span className="gx-link" style={{ color: "#545454" }}>
                    {TitleCaseFunction(text.location)}
                </span>
            ),
            onFilter: (value: any, record) => String(record.location).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.location.length - b.location.length,
            sortOrder: sortedInfo1?.columnKey === "location" ? sortedInfo.order : undefined,
        },
        {
            title: "City",
            key: "city",
            render: (text) => (
                <span className="gx-link" style={{ color: "#545454" }}>
                    {TitleCaseFunction(text.city)}
                </span>
            ),
            onFilter: (value: any, record) => String(record.city).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.city.length - b.city.length,
            sortOrder: sortedInfo1?.columnKey === "city" ? sortedInfo.order : undefined,
        },
        {
            title: "State",
            key: "state",
            render: (text) => (
                <span className="gx-link" style={{ color: "#545454" }}>
                    {TitleCaseFunction(text.state)}
                </span>
            ),
            onFilter: (value: any, record) => String(record.state).toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.state.length - b.state.length,
            sortOrder: sortedInfo1?.columnKey === "state" ? sortedInfo.order : undefined,
        },

        {
            title: "Action",
            key: "action",
            render: (text, record: any) => (
                <>
                    <span className="gx-link" onClick={() => renderEdit(text)}>
                        <i className="icon icon-edit" style={{ fontSize: '18px', marginRight: "25px" }} />
                    </span>

                    <span className="gx-link" onClick={() => showDeleteConfirm(text)}>
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
                <Card title="Airports">
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
                            <div> Add Airport</div>
                        </Button>
                    </div>

                    <Table className="gx-table-responsive" columns={columns} dataSource={airportsList} bordered onChange={handleChange} />

                </Card>

            )}
            <Modal
                title="Are you sure you want to delete this AIRPORT ?"
                visible={openModal}
                onOk={() => handleOk(deleteRecordId)}
                onCancel={handleCancel}
            >
            </Modal>
        </div>
    );
};

export default AirportsListing

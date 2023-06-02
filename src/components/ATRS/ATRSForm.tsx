import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Card, Spin } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../appRedux/store";
import { ATRSData, ATRSInputData } from '../../shared/interfaces/ATRS.interface';
import { addATRSAPI, getAirportByTerminalListAPI, getOneATRSByIdAPI, updateATRSAPI } from "../../services/atrs";
import { getAirportsListAPI } from "../../services/airport";
import { actionFormLoader } from "../../appRedux/actions/Actions";
import { message } from 'antd';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const inputLayout = {
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 12 },
    },
};


const ATRSForm: React.FC = () => {
    // CONSTANTS
    const TOKEN = localStorage.getItem("token");
    const [form] = Form.useForm();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id, viewatrs } = useParams<{ id: string; viewatrs: string }>();
    const { formLoader } = useSelector(({ common }: RootState) => common);

    // STATES
    const [atrsById, setATRSById] = useState<ATRSData | null>()
    const [terminalsList, setTerminalsList] = useState([])
    const [airportsList, setAirportsList] = useState([])
    const [refresh, toggleRefresh] = useState<boolean>(false);
    const [readEnabled, setReadEnabled] = useState(viewatrs ? true : false);
    const [showResults, setShowResults] = useState(id ? true : false);
    const [inputData, setInputData] = useState<ATRSInputData>({
        id: 0,
        name: "",
        terminal_id: 0,
        terminal_name: "",
        airport_id: 0,
        airport_name: "",
    });
    const [selectAirport, setSelectAirport] = useState<number | null>();
    const [selectAirportView, setSelectAirportView] = useState<boolean>(false);


    useEffect(() => {
        if (id) {
            renderATRSById(+id);
        } else {
            setATRSById(null)
        }
    }, [id]);

    useEffect(() => {
        if (atrsById) {
            setInputData({
                id: atrsById.id,
                name: atrsById.name,
                terminal_id: atrsById.terminal.id,
                terminal_name: atrsById.terminal.name,
                airport_id: atrsById.terminal.airport.id,
                airport_name: atrsById.terminal.airport.name
            });
            form.setFieldsValue({
                id: atrsById.id,
                name: atrsById.name,
                terminal_id: atrsById.terminal.id,
                terminal_name: atrsById.terminal.name,
                airport_id: atrsById.terminal.airport.id,
                airport_name: atrsById.terminal.airport.name
            });
        }
    }, [atrsById, form]);

    useEffect(() => {
        renderAirportsList();
    }, [refresh]);

    useEffect(() => {
        if (selectAirport) {
            renderTerminalsList()
        }
    }, [selectAirport])

    const renderATRSById = async (id: number) => {
        try {
            dispatch(actionFormLoader(true));
            const response = await getOneATRSByIdAPI(TOKEN!, id);
            if (response) {
                setATRSById(response.atrs);
            } else {
                message.error("Error");
            }
            dispatch(actionFormLoader(false));
        } catch (error) {
            console.log(error);
        }
    };

    const renderAirportsList = async () => {
        try {
            const response = await getAirportsListAPI(TOKEN);
            if (!response) {
                message.error("Error");
            }
            setAirportsList(response.airportList);
        } catch (error) {
            console.log(error);
        }
    };

    const renderTerminalsList = async () => {
        try {
            const response = await getAirportByTerminalListAPI(TOKEN!, selectAirport!);
            if (!response) {
                message.error("Error");
            }
            setSelectAirportView(true)
            setSelectAirport(null)
            setTerminalsList(response.terminals);
        } catch (error) {
            message.error("Terminal List not Found ?")
            console.log(error);
        }
    };

    // HANDLERS

    const onFinish = async () => {
        try {
            const { name, terminal_id, terminal_name, airport_id, airport_name } = inputData;
            const atrsObj = {
                name,
                airport_id: airport_id,
                terminal_id: terminal_id
            }
            if (id) {
                try {
                    const response = await updateATRSAPI(TOKEN!, +id, atrsObj);
                    if (response) {
                        if (response.message) {
                            message.success(response.message);
                            setSelectAirport(null)
                            history.push("/atrs/list");
                        }
                    } else {
                        message.error("Error");
                    }
                } catch (error) {
                    console.log("airportError", error);
                    message.error("ATRS name already exists. Please choose a different name.")
                }
            } else {
                try {
                    const response = await addATRSAPI(TOKEN!, atrsObj);
                    if (response) {
                        if (response.message) {
                            message.success(response.message);
                            setSelectAirport(null)
                            setSelectAirportView(false)
                            history.push("/atrs/list");
                        } else {
                            alert("Error");
                        }
                    }
                } catch (error) {
                    console.log("airportError", error);
                    message.error("ATRS name already exists. Please choose a different name.")
                }
            }
        } catch (error) {
            console.log(error);
        }
    };



    const handleInputData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputData((prevState: any) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleSelect = (value: number, name: string) => {
        if (name === "airport") {
            setSelectAirport(value)
            setInputData((prevState) => ({
                ...prevState,
                airport_id: value,
            }));
            form.setFieldsValue({ airport_id: value });
        } else if (name === "terminal") {
            setInputData((prevState) => ({
                ...prevState,
                terminal_id: value,
            }));
            form.setFieldsValue({ terminal_id: value });
        }
    };


    return (
        <div>
            {formLoader === true ? (
                <div className="spinnerLoader ">
                    <Spin tip="Loading..." size="large"></Spin>
                </div>
            ) : (
                <Card
                    className="gx-card"

                    title={` ${id && viewatrs ? "view" : id ? "Update" : "Add"} ATRS
                    
   `}
                >
                    <hr className="form-hr-line"></hr>
                    <Form {...formItemLayout} validateTrigger="onBlur" colon={false} form={form} name="register" onFinish={onFinish} scrollToFirstError>
                        {showResults ? (
                            <Form.Item name="id" label="ATRS ID" {...inputLayout}>
                                <Input disabled={Boolean(id)} name="id" onChange={handleInputData} />
                            </Form.Item>
                        ) : (
                            ""
                        )}

                        <Form.Item
                            {...inputLayout}
                            name="name"
                            label="ATRS Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input ATRS Name.",
                                },
                            ]}
                        >
                            <Input disabled={readEnabled} name="name" onChange={handleInputData} />
                        </Form.Item>

                        <Form.Item
                            {...inputLayout}
                            name="airport_name"
                            label="Airport Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Airport Name.",
                                },
                            ]}
                        >{readEnabled ? (<>
                            <Input disabled value={atrsById?.terminal.airport.name || ''} />
                        </>) : (
                            <Select
                                disabled={readEnabled}
                                placeholder="Select Airport Name"
                                onChange={(value: any) => {
                                    handleSelect(value, "airport");
                                }}
                                value={atrsById?.terminal.airport.id}
                            >
                                {airportsList?.map((item: any, index: any) => (
                                    <Option value={item.id} key={index}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        )}
                        </Form.Item>


                        {selectAirportView ? <Form.Item
                            {...inputLayout}
                            name="terminal_name"
                            label="Terminal Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Select Terminal Name.",
                                },
                            ]}
                        >{readEnabled ? (<>
                            <Input disabled value={atrsById?.terminal.name || ''} />
                        </>) : (
                            <Select
                                disabled={readEnabled}
                                placeholder="Select Terminal Name"
                                onChange={(value: any) => {
                                    handleSelect(value, "terminal");
                                }}
                                value={atrsById?.terminal.name}
                            >
                                {terminalsList?.map((item: any, index: any) => (
                                    <Option value={item.id} key={index}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        )}
                        </Form.Item> : ""}

                        {!readEnabled && (
                            <Form.Item {...tailFormItemLayout} className="form-button">
                                {id ? (
                                    <Button className="gx-mb-0 button-gradiant" htmlType="submit">
                                        Update
                                    </Button>
                                ) : (
                                    <Button className="gx-mb-0 button-gradiant" htmlType="submit">
                                        Submit
                                    </Button>
                                )}
                            </Form.Item>
                        )}

                        <Form.Item className="form-button form-button-pr">
                            <Button className="gx-mb-0 button-gradiant" htmlType="submit" onClick={() => history.push(`/atrs/list`)}>
                                Back
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default ATRSForm

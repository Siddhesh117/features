import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Card, Spin } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../appRedux/store";
import { TerminalInputData, TerminalsData } from '../../shared/interfaces/Terminal.interface';
import { actionFormLoader } from "../../appRedux/actions/Actions";
import { addTerminalAPI, getOneTerminalByIdAPI, updateTerminalAPI } from "../../services/terminal";
import { getAirportsListAPI } from "../../services/airport";
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

const TerminalForm: React.FC = () => {
    // CONSTANTS
    const TOKEN = localStorage.getItem("token");
    const [form] = Form.useForm();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id, viewterminal } = useParams<{ id: string; viewterminal: string }>();
    const { formLoader } = useSelector((state: RootState) => state.common);

    // STATES
    const [terminalById, setTerminalById] = useState<TerminalInputData | null>()
    const [airportsList, setAirportsList] = useState<any>()
    const [refresh, toggleRefresh] = useState<boolean>(false);
    const [readEnabled, setReadEnabled] = useState(viewterminal ? true : false);
    const [showResults, setShowResults] = useState(id ? true : false);
    const [inputData, setInputData] = useState<TerminalsData>({
        id: 0,
        name: "",
        airport_id: 0,
        airport_name: ""
    });

    useEffect(() => {
        if (id) {
            renderTerminalById(+id);
        } else {
            setTerminalById(null)
        }
    }, [id, dispatch]);


    useEffect(() => {
        if (terminalById) {
            setInputData({
                id: terminalById.id,
                name: terminalById.name,
                airport_id: terminalById.airport.id,
                airport_name: terminalById.airport.name
            });
            form.setFieldsValue({
                id: terminalById.id,
                name: terminalById.name,
                airport_id: terminalById.airport.id,
                airport_name: terminalById.airport.name
            });
        }
    }, [terminalById, form]);


    useEffect(() => {
        renderAirportsList();
    }, [refresh]);



    const renderTerminalById = async (id: number) => {
        try {
            const response = await getOneTerminalByIdAPI(TOKEN!, id);
            if (response) {
                setTerminalById(response?.terminal);
            } else {
                message.error("Error");
            }
        } catch (error) {
            console.log(error);
        }
    };


    const renderAirportsList = async () => {
        try {
            dispatch(actionFormLoader(true));
            await getAirportsListAPI(TOKEN).then((response) => {
                if (!response) {
                    message.error("Error");
                }
                setAirportsList(response.airportList)
                dispatch(actionFormLoader(false));
            });
        } catch (error: any) {
            console.log(error)
        }
    };

    const onFinish = async () => {
        try {
            const { name, airport_id } = inputData;
            let terminalObj = {
                name,
                airport_id
            };
            if (id) {
                try {
                    const response = await updateTerminalAPI(TOKEN!, +id, terminalObj)
                    if (response) {
                        if (response?.message) {
                            message.success(response?.message);
                            toggleRefresh(true);
                            history.push("/terminals/list");
                        }
                    } else {
                        message.error("Error");
                    }
                } catch (error) {
                    console.log("terminalError", error);
                    message.error("Terminal name already exists. Please choose a different name.")
                }
            } else {
                try {
                    const response = await addTerminalAPI(TOKEN!, terminalObj)
                    if (response) {
                        if (response?.message) {
                            message.success(response.message);
                            toggleRefresh(true);
                            history.push("/terminals/list");
                        }
                    } else {
                        message.error("Error");
                    }
                } catch (error) {
                    console.log("terminalError", error);
                    message.error("ATRS name already exists. Please choose a different name.")
                }
            }
        } catch (error) {
            console.log(error)
        }
    };


    const handleInputData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelect = (value: number, name: string) => {
        if (name === "airport") {
            setInputData((prevState) => ({
                ...prevState,
                airport_id: value as number,
            }));
            form.setFieldsValue({ airport_id: value });
        }
    };

    return (
        <div>
            {formLoader ===
                true ? (
                <div className="spinnerLoader">
                    <Spin tip="Loading..." size="large" />
                </div>
            ) : (
                <Card
                    className="gx-card"
                    title={` ${id && viewterminal ? "View" : id ? "Update" : "Add"} Terminal`}
                >
                    <hr className="form-hr-line" />
                    <Form
                        {...formItemLayout}
                        validateTrigger="onBlur"
                        colon={false}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        scrollToFirstError
                    >
                        {showResults ? (
                            <Form.Item name="id" label="Terminal ID" {...inputLayout}>
                                <Input disabled={Boolean(id)} name="id" onChange={handleInputData} />
                            </Form.Item>
                        ) : (
                            ""
                        )}

                        <Form.Item
                            {...inputLayout}
                            name="airport_name"
                            label="Airport Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select an airport name.",
                                },
                            ]}
                        >
                            {readEnabled ? (<>
                                <Input disabled value={terminalById?.airport?.name || ''} />
                            </>) : (

                                <Select
                                    disabled={readEnabled}
                                    placeholder="Select Airport Name"
                                    onChange={(value: any) => {
                                        handleSelect(value, "airport");
                                    }}
                                    value={terminalById?.airport?.name}
                                >
                                    {airportsList?.map((airport: any, index: any) => (
                                        <Option value={airport?.id} key={index}>
                                            {airport?.name}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>


                        <Form.Item
                            {...inputLayout}
                            name="name"
                            label="Terminal Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input Terminal Name.",
                                },
                            ]}
                        >
                            <Input disabled={readEnabled} name="name" onChange={handleInputData} />
                        </Form.Item>

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
                            <Button
                                className="gx-mb-0 button-gradiant"
                                htmlType="submit"
                                onClick={() => history.push(`/terminals/list`)}
                            >
                                Back
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default TerminalForm;

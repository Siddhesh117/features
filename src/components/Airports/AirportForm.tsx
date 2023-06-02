import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Spin, Select } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../appRedux/store';
import { AirportsData } from '../../shared/interfaces/Airports.interface';
import { addAirportAPI, getOneAirportByIdAPI, updateAirportAPI } from '../../services/airport';
import { message } from 'antd';
import { cityList, stateList } from '../data';

const { Item } = Form;

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

const AirportForm: React.FC = () => {
    // CONSTANTS
    const TOKEN = localStorage.getItem("token");
    const [form] = Form.useForm();
    const history = useHistory();
    const { id, viewairport } = useParams<{ id: string; viewairport: string }>();
    const { formLoader } = useSelector(({ common }: RootState) => common);

    // STATES
    const [airportById, setAirportById] = useState<AirportsData | null>()
    const [readEnabled, setReadEnabled] = useState(viewairport ? true : false);
    const [showResults, setShowResults] = useState(id ? true : false);
    const [inputData, setInputData] = useState<AirportsData>({
        name: '',
        location: '',
        city: '',
        state: '',
    });

    useEffect(() => {
        if (id) {
            renderAirportById(+id)
        } else {
            setAirportById(null);
        }
    }, [id]);

    useEffect(() => {
        if (airportById) {
            setInputData(airportById);
            form.setFieldsValue(airportById);
        }
    }, [airportById, form]);



    const renderAirportById = async (id: number) => {
        try {
            const response = await getOneAirportByIdAPI(TOKEN!, id);
            setAirportById(response.airport);
        } catch (error) {
            console.log(error);
        }
    };


    const onFinish = async () => {
        try {
            const { name, location, city, state } = inputData;
            let airportObj = {
                name,
                location,
                city,
                state
            };
            if (id) {
                try {
                    const response = await updateAirportAPI(TOKEN!, +id, airportObj);
                    if (response) {
                        if (response.message) {
                            message.success(response.message);
                            history.push("/airports/list");
                        }
                    } else {
                        message.error("Error");
                    }
                } catch (error) {
                    console.log("airportError", error);
                    message.error("Airport name already exists. Please choose a different name.")
                }
            } else {
                try {
                    const response = await addAirportAPI(TOKEN!, airportObj);
                    if (response) {
                        if (response.message) {
                            message.success(response.message);
                            history.push("/airports/list");
                        }
                    } else {
                        message.error("Error");
                    }
                } catch (error) {
                    console.log("airportError", error);
                    message.error("Airport name already exists. Please choose a different name.")
                }
            }
        } catch (error) {
            console.log(error);
            message.error("Please authenticate with a valid token")
        }
    };


    const handleInputData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelect = (value: number | string, name: string) => {
        if (name === "city") {
            setInputData((prevState) => ({
                ...prevState,
                city: value as string,
            }));
            form.setFieldsValue({ city: value });
        } else if (name === "state") {
            setInputData((prevState) => ({
                ...prevState,
                state: value as string,
            }));
            form.setFieldsValue({ state: value });
        }
    };

    return (
        <div>
            {formLoader === true ? (
                <div className="spinnerLoader">
                    <Spin tip="Loading..." size="large" />
                </div>
            ) : (
                <Card className="gx-card" title={` ${id && viewairport ? 'View' : id ? 'Update' : 'Add'} Airport`}>
                    <hr className="form-hr-line" />
                    <Form {...formItemLayout} validateTrigger="onBlur" colon={false} form={form} name="register" onFinish={onFinish} scrollToFirstError>
                        {showResults && (
                            <Item name="id" label="Airport ID" {...inputLayout}>
                                <Input disabled={Boolean(id)} name="id" onChange={handleInputData} />
                            </Item>
                        )}

                        <Form.Item
                            {...inputLayout}
                            name="name"
                            label="Airport Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Airport Name.',
                                },
                            ]}
                        >
                            <Input disabled={readEnabled} name="name" onChange={handleInputData} />
                        </Form.Item>

                        <Form.Item
                            {...inputLayout}
                            name="state"
                            label="State"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select state.',
                                },
                            ]}
                        >
                            {readEnabled ? (
                                <Input disabled value={airportById?.location || ''} />
                            ) : (
                                <Select
                                    disabled={readEnabled}
                                    placeholder="Select State Name"
                                    onChange={(value: any) => {
                                        handleSelect(value, "state");
                                    }}
                                    value={airportById?.state}
                                >
                                    {stateList?.map((item: any, index: any) => (
                                        <Select.Option value={item?.name} key={index}>
                                            {item?.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>




                        <Form.Item
                            {...inputLayout}
                            name="city"
                            label="City"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select City.',
                                },
                            ]}
                        >
                            {readEnabled ? (
                                <Input disabled value={airportById?.location || ''} />
                            ) : (
                                <Select
                                    disabled={readEnabled}
                                    placeholder="Select City Name"
                                    onChange={(value: any) => {
                                        handleSelect(value, "city");
                                    }}
                                    value={airportById?.city}
                                >
                                    {cityList?.map((item: any, index: any) => (
                                        <Select.Option value={item?.name} key={index}>
                                            {item?.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item
                            {...inputLayout}
                            name="location"
                            label="Location"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Location.',
                                },
                            ]}
                        >
                            <Input disabled={readEnabled} name="location" onChange={handleInputData} />
                        </Form.Item>



                        {!readEnabled && (
                            <Form.Item {...tailFormItemLayout} className="form-button">
                                <Button className="gx-mb-0 button-gradiant" htmlType="submit">
                                    {id ? 'Update' : 'Submit'}
                                </Button>
                            </Form.Item>
                        )}

                        <Form.Item className="form-button form-button-pr">
                            <Button className="gx-mb-0 button-gradiant" onClick={() => history.push('/airports/list')}>
                                Back
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default AirportForm;


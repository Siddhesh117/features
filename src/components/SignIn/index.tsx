import { Button, Form, Input } from "antd";
import Login_Image from "../../assets/pictures/loging_Left_img.png";
import { useHistory } from "react-router-dom";


const SignIn = () => {
  const expirationTime = localStorage.getItem("expirationTime")!;
  let expires = new Date();
  expires.setTime(expires.getTime() + +expirationTime);
 
  const history = useHistory();
  return (
    <div className="gx-app-login-wrap">
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div style={{ height: "500px" }}>
              <img alt="lo" src={Login_Image} />
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              autoComplete="off"
              initialValues={{ remember: true }}
              name="basic"
              className="gx-signin-form gx-form-row0"
              style={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div className="loginText">Login Page</div>
              <span>Please enter your details.</span>
              <Form.Item style={{ marginTop: "4px" }} name="name">
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item style={{ marginTop: "4px" }} name="password">
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button className="loginButton" htmlType="submit"
                 onClick={() => {
                  history.push(`/user/list`);
                }}
                 >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

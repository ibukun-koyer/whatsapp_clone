import { Form } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";

import { Formik } from "formik";
import AuthBkg from "./AuthBkg";
import CenteredBtn from "./centeredBtn";

import { Link, useHistory } from "react-router-dom";
import OrDivider from "./orDivider";

function Login() {
  const history = useHistory();

  const authentication = useAuth();
  useEffect(() => {
    if (authentication.currentUser) {
      history.replace("/");
    }
  });

  const [serverError, setServerError] = useState("");
  return (
    <AuthBkg serverError={serverError} setServerError={setServerError}>
      <Formik
        onSubmit={(values) => {
          authentication
            .login(values.email, values.password)
            .then(() => {
              setServerError("");
     
            })
            .catch((e) => {
    
              setServerError(e.message);
            });
        }}
        initialValues={{
          email: "",
          password: "",
        }}
        validate={(values) => {
          const errors = {};
          function required(str, err, member) {
            if (!str) {
              errors[member] = err;
            }
          }

          required(values.email, "Email is required", "email");
          if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) &&
            errors.email === undefined
          ) {
            errors.email = "Invalid email address";
          }
          required(values.password, "Password is required", "password");
          if (values.password.length < 8 && errors.password === undefined) {
            errors.password = "Password must be atleast 8 character long";
          } else if (
            !/[A-Z]/.test(values.password) &&
            errors.password === undefined
          ) {
            errors.password = "Password must contain an uppercase letter";
          } else if (
            !/[a-z]/.test(values.password) &&
            errors.password === undefined
          ) {
            errors.password = "Password must contain a lowercase letter";
          } else if (
            !/[0-9]/.test(values.password) &&
            errors.password === undefined
          ) {
            errors.password = "Password must contain a numeric character";
          } else if (
            !/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(values.password) &&
            errors.password === undefined
          ) {
            errors.password = "Password must contain a special character";
          }

          return errors;
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <h3 style={{ textAlign: "center" }}>Log In</h3>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                placeholder="Enter email"
                className={touched.email && errors.email ? "is-invalid" : null}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                placeholder="Password"
                className={
                  touched.password && errors.password ? "is-invalid" : null
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <CenteredBtn variant="success">Login</CenteredBtn>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                padding: "1rem",
                color: "var(--extremeDarkGreen)",
              }}
            >
              <Link to="/passwordRecovery" style={{ textDecoration: "none" }}>
                Forgot your password?
              </Link>
            </div>
            <OrDivider />
            <CenteredBtn
              variant="success"
              onClick={() => history.push("/signup")}
            >
              Sign Up
            </CenteredBtn>
          </Form>
        )}
      </Formik>
    </AuthBkg>
  );
}
export default Login;

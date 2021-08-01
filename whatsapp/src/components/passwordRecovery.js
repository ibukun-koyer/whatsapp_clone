import { Form } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { useState } from "react";

import { Formik } from "formik";
import AuthBkg from "./AuthBkg";
import CenteredBtn from "./centeredBtn";
import Alert from "./alert";
import { Link } from "react-router-dom";

function PasswordRecovery() {
  const authentication = useAuth();
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthBkg serverError={serverError} setServerError={setServerError}>
      {sent === true ? (
        <Alert
          color="green"
          header="Email has been sent"
          msg="Please check your email and follow the link to reset your password"
          onClick={() => setSent(false)}
          closeTxt="close"
        />
      ) : null}
      <Formik
        onSubmit={(values) => {
          authentication
            .resetPassword(values.email)
            .then(() => {
              setSent(true);
            })
            .catch((e) => {});
        }}
        initialValues={{
          email: "",
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
            <h3 style={{ textAlign: "center" }}>Password recovery</h3>
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
            <CenteredBtn variant="success">Recover password</CenteredBtn>
          </Form>
        )}
      </Formik>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "1rem",
          color: "var(--pureBlack)",
        }}
      >
        <Link to="/signup" style={{ textDecoration: "none" }}>
          Sign up
        </Link>
        <span> | </span>
        <Link to="/login" style={{ textDecoration: "none" }}>
          Login
        </Link>
      </div>
    </AuthBkg>
  );
}
export default PasswordRecovery;

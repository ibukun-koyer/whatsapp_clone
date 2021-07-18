import { Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import classes from "./signup.module.css";
import { Formik } from "formik";
import AuthBkg from "./AuthBkg";
import { useHistory } from "react-router-dom";
import CenteredBtn from "./centeredBtn";
import OrDivider from "./orDivider";
import { onImageChange, onImageSubmit } from "./helperFiles/imageHandler";
// let height = window.innerHeight + "px";

function SignUp() {
  // console.log(process.env.REACT_APP_cloudinary);/
  const history = useHistory();
  const [serverError, setServerError] = useState("");
  const defaultImage =
    "https://th.bing.com/th/id/OIP.Psj56s3oU0aQkeZNr_rqpAEsEs?pid=ImgDet&rs=1";
  const [imageRef, setImageRef] = useState(defaultImage);
  const [imageError, setImageError] = useState("");
  const authentication = useAuth();
  useEffect(() => {
    if (authentication.currentUser) {
      history.replace("/");
    }
  });
  function handleImage(e) {
    const fileObj = e.target.files[0];

    onImageChange(fileObj, setImageError, setImageRef);
  }

  return (
    <AuthBkg serverError={serverError} setServerError={setServerError}>
      <Formik
        onSubmit={(values) => {
          const onImageStoredCallback = (url) => {
            const user = {
              username: `${values.firstName} ${values.middleName} ${values.lastName}`,
              url: url,
            };
            authentication.setInfo(user);
            authentication
              .signup(values.email, values.password)
              .then(() => {
                setServerError("");
                console.log("successful");
              })
              .catch((e) => {
                console.log("failed");
                setServerError(e.message);
              });
          };
          onImageSubmit(
            defaultImage,
            imageRef,
            onImageStoredCallback,
            setImageError,
            "image"
          );
        }}
        initialValues={{
          firstName: "",
          middleName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          email: "",
        }}
        validate={(values) => {
          const errors = {};
          function required(str, err, member) {
            if (!str) {
              errors[member] = err;
            }
          }
          required(values.firstName, "First name is required", "firstName");
          required(values.middleName, "Middle name is required", "middleName");
          required(values.lastName, "Last name is required", "lastName");
          required(values.email, "Email is required", "email");
          if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) &&
            errors.email === undefined
          ) {
            errors.email = "Invalid email address";
          }
          required(values.password, "Password is required", "password");
          required(
            values.confirmPassword,
            "This field is required",
            "confirmPassword"
          );
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
          if (
            values.confirmPassword !== values.password &&
            errors.confirmPassword === undefined
          ) {
            errors.confirmPassword = "Passwords do not match";
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
            <h3 style={{ textAlign: "center" }}>SIGNUP FORM</h3>
            <div className={classes.wrapImage}>
              <div className={classes.userImage}>
                <img src={imageRef} alt="profile" className={classes.pp} />
              </div>

              <input
                className={classes.imagePicker}
                id="upload"
                type="file"
                accept="image/*"
                multiple={false}
                onChange={handleImage}
              />
            </div>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {imageError === "" ? null : (
                <div style={{ color: "var(--errorRed)" }}>*{imageError}</div>
              )}
            </div>
            <Row>
              <Col>
                <Form.Group controlId="formBasicFirst">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="First Name"
                    className={
                      touched.firstName && errors.firstName
                        ? "is-invalid"
                        : null
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBasicMiddle">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.middleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="middleName"
                    placeholder="Middle Name"
                    className={
                      touched.middleName && errors.middleName
                        ? "is-invalid"
                        : null
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.middleName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formBasicLast">
                  <Form.Label>Lase Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="lastName"
                    placeholder="Last Name"
                    className={
                      touched.lastName && errors.lastName ? "is-invalid" : null
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
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
              </Col>
              <Col>
                <Form.Group controlId="formBasicConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="confirmPassword"
                    placeholder="Password"
                    className={
                      touched.confirmPassword && errors.confirmPassword
                        ? "is-invalid"
                        : null
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
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
            <CenteredBtn variant="success">Sign Up</CenteredBtn>
            <OrDivider />
            <CenteredBtn
              variant="success"
              onClick={() => history.push("/login")}
            >
              Log In
            </CenteredBtn>
          </Form>
        )}
      </Formik>
    </AuthBkg>
  );
}

export default SignUp;

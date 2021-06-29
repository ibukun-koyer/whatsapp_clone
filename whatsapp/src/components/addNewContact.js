import classes from "./addNewContact.module.css";
import form from "./signup.module.css";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { Form } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import { Formik } from "formik";

import { useAuth } from "../context/authContext";
import CenteredBtn from "./centeredBtn";
import Alert from "./alert";
import { useFull } from "../context/requestFullScreen";
import firebase from "firebase";
import useKey from "./hooks/useKey";
function AddNewContact() {
  const fullScreen = useFull();
  const authentication = useAuth();
  const [checkExistentce, setCheck] = useState(false);
  const [animateOff, setAnimateOff] = useState(false);
  const [feedback, setFeedback] = useState({
    fbType: "",
    fbHeader: "",
    fbDes: "",
  });

  useKey("Escape", () => {
    setAnimateOff(true);
  });
  const emailRef = useRef();
  useEffect(() => {
    if (checkExistentce === true) {
      const ref = firebase
        .database()
        .ref(`users/${replaceInvalid(emailRef.current.value)}`);
      console.log(replaceInvalid(emailRef.current.value));
      ref.once("value", (snapshot) => {
        const obj = snapshot.val();
        console.log(obj);
        if (!obj) {
          console.log("user does not exist");
          setFeedback({
            fbType: "red",
            fbHeader: "An error has occured",
            fbDes:
              "please verify that the email address added is correct and try again.",
          });
        } else {
          //create new contact meetup
          //perform a check here to see if the contact has been stored already
          if (obj.uid === authentication.currentUser.uid) {
            console.log("You cannot add urself");
            setFeedback({
              fbType: "red",
              fbHeader: "An error has occured",
              fbDes: "You are unable to add yourself to your contacts.",
            });
          } else {
            if (
              obj.contacts &&
              obj.contacts[`${authentication.currentUser.uid}`]
            ) {
              console.log("user has already been added");
              setFeedback({
                fbType: "red",
                fbHeader: "An error has occured",
                fbDes:
                  "The user being added as been added before, you can't add a user twice.",
              });
            } else {
              const newMeetup = {
                messages: {
                  cleared: "",
                },
              };
              const meetingRef = firebase.database().ref("/contacts");
              const key = meetingRef.push(newMeetup).key;

              const info = key;

              ref
                .child(
                  `contacts/${replaceInvalid(authentication.currentUser.email)}`
                )
                .set(info);
              firebase
                .database()
                .ref(
                  `users/${replaceInvalid(
                    authentication.currentUser.email
                  )}/contacts/${ref.key}`
                )
                .set(info);
              setFeedback({
                fbType: "green",
                fbHeader: "User added successfully",
                fbDes: "The new contact has been added successfully.",
              });
              // fullScreen.provideFullScreen(0);
              setAnimateOff(true);
            }
          }
        }
      });
      setCheck(false);
    }
  }, [
    checkExistentce,
    authentication.currentUser.email,
    authentication.currentUser.uid,
    fullScreen,
  ]);
  return (
    <div
      className={
        classes.fullScreen + " " + (animateOff ? classes.animateOff : "")
      }
      key={animateOff}
      onAnimationEnd={(e) => {
        if (animateOff) {
          fullScreen.provideFullScreen(0);
        }
      }}
    >
      {feedback.fbType !== "" ? (
        <Alert
          color={feedback.fbType}
          header={feedback.fbHeader}
          msg={feedback.fbDes}
          onClick={() =>
            setFeedback({
              fbType: "",
              fbHeader: "",
              fbDes: "",
            })
          }
          closeTxt="close"
        />
      ) : null}
      <div className={form.form}>
        {" "}
        <Formik
          onSubmit={(values) => {
            setCheck(true);
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
              <h3 style={{ textAlign: "center" }}>Add New Contact</h3>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  ref={emailRef}
                  placeholder="Enter email"
                  className={
                    touched.email && errors.email ? "is-invalid" : null
                  }
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <CenteredBtn variant="success">Add</CenteredBtn>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
export default AddNewContact;

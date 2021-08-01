import classes from "./dropDown.module.css";
import { useOption } from "../context/showOptions";
import { useEffect } from "react";
import firebase from "firebase/app";
import { useReply } from "../context/replyContext";

import shouldShowDropDown from "./helperFiles/shouldDropDown";
function DropDownForMessage({
  currentlyClicked,
  setCurrentlyClicked,
  createdAt,
  meetingRoom,
  myEmail,
  yourEmail,
  message,
  exceptionSubtractionX,
  type,
  externalArr,
  link,
  messages,
  contactType,
}) {
  const reply = useReply();
  const context = useOption();
  //if we are not showing the option, then it means nomessage is using the dropdown, so no message is focused
  useEffect(() => {
    if (!context.getShow) {
      setCurrentlyClicked(false);
    }
  }, [context.getShow, setCurrentlyClicked]);
  // this useeffect basically just defines what happens when we click the options.
  useEffect(() => {
    //we set the output of the option context when we click on one
    if (context.getOutput) {
      //if the output/clicked is delete, then we want to delete a message
      if (context.getOutput.toLowerCase().indexOf("delete") !== -1) {
        firebase
          .database()
          .ref(`${contactType}s/${meetingRoom}/messages/${createdAt}/deletedBy`)
          .push(myEmail);
        //we delete by adding my email to the deletedby section of the messaging section
        messages[createdAt].deletedBy = { 0: myEmail };
      }
      //if we are replying a message
      if (context.getOutput.toLowerCase().indexOf("reply") !== -1) {
        //get the username of the text message, then we set the reply data into the reply context
        async function get() {
          let name = "";
          await firebase
            .database()
            .ref(`users/${yourEmail}/username`)
            .once("value")
            .then((val) => (name = val.val()));

          reply.setReply(
            name,
            message,
            myEmail === yourEmail ? "mine" : "yours",
            yourEmail,
            type,
            link
          );
        }

        get();
      }
      //if we are clearing out message
      if (context.getOutput.toLowerCase().indexOf("clear") !== -1) {
        //set ur email in the cleared field to the current time
        firebase
          .database()
          .ref(`${contactType}s/${meetingRoom}/messages/cleared`)
          .child(myEmail)
          .set(firebase.firestore.Timestamp.now().seconds * -1);
      }
      // clean out the output field after acting upon the selected action
      context.setOutput("");
    }
  }, [
    context.getOutput,
    context,
    createdAt,
    link,
    meetingRoom,
    message,
    myEmail,
    reply,
    type,
    yourEmail,
    messages,
  ]);

  return (
    // this is the downward angle icon that appears when you hover
    <i
      className="fa fa-angle-down"
      id={classes.dropDown}
      onClick={(e) => {
        shouldShowDropDown(
          e.target,
          context,
          createdAt,
          externalArr,
          exceptionSubtractionX,
          setCurrentlyClicked,
          () => currentlyClicked === createdAt && context.getShow
        );
      }}
    ></i>
  );
}
export default DropDownForMessage;

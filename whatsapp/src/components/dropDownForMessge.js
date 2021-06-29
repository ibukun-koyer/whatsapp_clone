import classes from "./dropDown.module.css";
import { useOption } from "../context/showOptions";
import { useEffect } from "react";
import firebase from "firebase";
import { useReply } from "../context/replyContext";
// import { Dropdown } from "bootstrap";
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
}) {
  const reply = useReply();
  const context = useOption();
  useEffect(() => {
    if (!context.getShow) {
      setCurrentlyClicked(false);
    }
  }, [context.getShow, setCurrentlyClicked]);
  useEffect(() => {
    if (context.getOutput) {
      if (context.getOutput.toLowerCase().indexOf("delete") !== -1) {
        firebase
          .database()
          .ref(`contacts/${meetingRoom}/messages/${createdAt}/deletedBy`)
          .push(myEmail);
        messages[createdAt].deletedBy = { 0: myEmail };
      }
      if (context.getOutput.toLowerCase().indexOf("reply") !== -1) {
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
  ]);

  return (
    <i
      className="fa fa-angle-down"
      id={classes.dropDown}
      onClick={(e) => {
        //get offsetHeight
        if (currentlyClicked === createdAt && context.getShow) {
          context.setShow(false);
        } else {
          let heightFromTop;
          let LengthFromLeft;
          let currNode = e.target;
          let bodyScrollHeight = 0;

          heightFromTop = 0;
          LengthFromLeft = 0;
          while (currNode.className.indexOf("mainHome") === -1) {
            if (window.getComputedStyle(currNode).position !== "static") {
              if (
                currNode.className.indexOf("screen") === -1 &&
                currNode.className.indexOf("message") === -1
              ) {
                heightFromTop += currNode.offsetTop;
              }
              if (currNode.className.indexOf("body") !== -1) {
                bodyScrollHeight = currNode.scrollTop;
              }
              LengthFromLeft += currNode.offsetLeft;
              console.log(heightFromTop, LengthFromLeft);
            }
            currNode = currNode.parentElement;
          }

          heightFromTop -= bodyScrollHeight;

          heightFromTop += currNode.offsetTop;
          LengthFromLeft += currNode.offsetLeft;

          if (exceptionSubtractionX) {
            LengthFromLeft -= exceptionSubtractionX;
          }

          setCurrentlyClicked(createdAt);

          //requesting full screen
          const defaultArr = ["Reply", "Delete Message"];

          const menuOptions = externalArr ? externalArr : defaultArr;
          context.setMarginSize(1.5);
          context.setFontSize(1);
          context.setNumberOfOptions(menuOptions.length);
          context.setX(LengthFromLeft);
          context.setY(heightFromTop);
          context.setHeight(
            parseFloat(window.getComputedStyle(e.target).height)
          );
          context.setMenuOptions(menuOptions);

          context.setShow(true);
        }
      }}
    ></i>
  );
}
export default DropDownForMessage;

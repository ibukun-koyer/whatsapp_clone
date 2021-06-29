import external from "./allMessages.module.css";
import classes from "./chatPage.module.css";
import { useScreen2 } from "../context/screen2Context";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import { useAuth } from "../context/authContext";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { Text } from "./helperFiles/messageTypeTemplates";
import Chat from "./chat";

import { useReply } from "../context/replyContext";
import Attachments from "./attachments";
import SendSVG from "./SVG/sendSVG";
import ThreeDotSVG from "./SVG/threeDotsSVG";
import useKey from "./hooks/useKey";
function ChatPage() {
  const reply = useReply();
  const authentication = useAuth();
  const messageRef = useRef();
  const context = useScreen2();
  const [showSendIcon, setSendIcon] = useState(false);
  const [show, setShow] = useState(false);

  //const handling scroll manover
  const [shouldScrollToBottom, setScrollToBottom] = useState(true);
  const bodyRef = useRef();

  const [meetingRoom, setMeetingRoom] = useState("");
  useEffect(() => {
    async function getMeetingId() {
      const ref = firebase
        .database()
        .ref(
          `users/${replaceInvalid(authentication.currentUser.email)}/contacts/${
            context.state.email
          }`
        );

      await ref.once("value", (snapshot) => {
        setMeetingRoom(snapshot.val());
      });
    }
    getMeetingId();
  }, [authentication.currentUser.email, context.state.email]);

  function send() {
    const replyObj = reply.isClosed()
      ? ""
      : {
          username: reply.getUsername(),
          message: reply.getMessage(),
          owner: reply.getEmail(),
          type: reply.getType(),
          link: reply.getLink(),
        };
    if (!reply.isClosed()) {
      reply.close();
    }
    const message = new Text(
      replaceInvalid(authentication.currentUser.email),
      replyObj,
      messageRef.current.value
    );
    // console.log(message.message);
    const sendRef = firebase
      .database()
      .ref(`/contacts/${meetingRoom}/messages`)
      .child(firebase.firestore.Timestamp.now().seconds * -1);

    sendRef.set(message.message);
    // sendRef.update({ message: message.message.message });
    sendRef.update({ data: { d: false } });

    if (messageRef.current) {
      messageRef.current.value = "";
    }
  }
  useKey("Enter", () => {
    if (
      messageRef.current.value.length &&
      document.activeElement === messageRef.current
    ) {
      send();
    }
  });
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className={external.top + " " + external.darkGray + " " + classes.nav}
      >
        <div className={external.pp + " " + classes.ppUpdated}>
          <div className={external.img} style={{ overflow: "hidden" }}>
            <img
              src={context.state.url}
              alt="contacts icons"
              className={classes.pp}
            />
          </div>
          <div className={classes.userInfo}>
            <div>{context.state.username}</div>
            <div className={classes.onlineStat}>
              {context.state.online === true ? "Online" : "Last seen at x"}
            </div>
          </div>
        </div>

        <div className={classes.navOptions}>
          {" "}
          <i className="fa fa-search" aria-hidden="true"></i>
          <ThreeDotSVG />
        </div>
      </div>

      <div
        className={
          classes.backgroundColor +
          " " +
          (reply.isClosed() ? "" : classes.decreaseHeight)
        }
      ></div>
      <div
        className={
          classes.background +
          " " +
          (reply.isClosed() ? "" : classes.decreaseHeight)
        }
      ></div>
      <div
        className={
          classes.body + " " + (reply.isClosed() ? "" : classes.decreaseHeight)
        }
        onScroll={(e) => {
          const divHeight = parseInt(window.getComputedStyle(e.target).height);

          if (
            Math.ceil(e.target.scrollTop + divHeight) + 1 <
            e.target.scrollHeight
          ) {
            if (shouldScrollToBottom === true) {
              setScrollToBottom(false);
            }
          } else {
            if (shouldScrollToBottom === false) {
              setScrollToBottom(true);
            }
          }
          if (e.target.scrollTop === 0) {
            setShow(true);
          }
        }}
        ref={bodyRef}
      >
        <Chat
          meetingRoom={meetingRoom}
          myEmail={replaceInvalid(authentication.currentUser.email)}
          show={show}
          setShow={setShow}
          bodyRef={bodyRef}
          shouldScrollToBottom={shouldScrollToBottom}
          setScrollToBottom={setScrollToBottom}
          track={context.rerender}
        />
      </div>
      <div>
        {reply.isClosed() ? null : (
          <div className={classes.replySection}>
            <div className={classes.replyBox}>
              <div
                className={
                  classes.replyUsername +
                  " " +
                  (reply.getOwner() === "mine"
                    ? classes.blueText
                    : classes.greenText)
                }
              >
                {reply.getUsername()}
              </div>
              <div className={classes.replyMessage}>
                {reply.getType() === "image" ? (
                  <span>
                    <i
                      className="fa fa-camera"
                      style={{ padding: "0", fontSize: "1rem", margin: "0" }}
                    ></i>{" "}
                    <span>
                      <img
                        src={reply.getLink()}
                        alt={"reply"}
                        className={classes.displayMediaSmall}
                      />
                    </span>
                  </span>
                ) : reply.getType() === "video" ? (
                  <span>
                    <i
                      className="fa fa-video-camera"
                      aria-hidden="true"
                      style={{ padding: "0", fontSize: "1rem", margin: "0" }}
                    ></i>{" "}
                    <video
                      src={reply.getLink()}
                      alt={"image reply"}
                      className={classes.displayMediaSmall}
                    >
                      Not supported on your browser
                    </video>
                  </span>
                ) : null}
                {reply.getMessage()?.slice(0, 75)}
                {!reply.getMessage() &&
                  (reply.getType() === "image" ? "Photo" : "Video")}
              </div>
              <div
                className={
                  classes.replyBorder +
                  " " +
                  (reply.getOwner() === "mine"
                    ? classes.blueBkg
                    : classes.greenBkg)
                }
              ></div>
            </div>
            <i
              className="fa fa-times"
              aria-hidden="true"
              onClick={() => reply.close()}
            ></i>
          </div>
        )}
        <div className={classes.input}>
          <Attachments meetingRoom={meetingRoom} />
          <input
            placeholder="Type a message"
            type="text"
            ref={messageRef}
            key={context.state.email}
            onChange={() => {
              if (messageRef.current.value.length > 0) {
                setSendIcon(true);
              } else {
                setSendIcon(false);
              }
            }}
          />
          {showSendIcon ? <SendSVG onClick={send} /> : null}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;

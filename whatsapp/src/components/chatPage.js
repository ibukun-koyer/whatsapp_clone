import external from "./allMessages.module.css";
import classes from "./chatPage.module.css";
import { useScreen2 } from "../context/screen2Context";
import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import { useAuth } from "../context/authContext";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { Text } from "./helperFiles/messageTypeTemplates";
import Chat from "./chat";

import { useReply } from "../context/replyContext";
import Attachments from "./attachments";
import SendSVG from "./SVG/sendSVG";

import useKey from "./hooks/useKey";
import BackgroundChat from "./backgroundChat";

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
  const offlineString = (online) => {
    let blank_str = "Last seen ";
    return (
      blank_str +
      (new Date(online).toLocaleDateString() === new Date().toLocaleDateString()
        ? "Today"
        : new Date(online).toLocaleDateString())
    );
  };
  const [current_status, set_current_status] = useState(
    context.state.online === true
      ? "Online"
      : offlineString(context.state.online)
  );

  // get the meeting room of the session
  useEffect(() => {
    // if context.state.email then it is a contact
    if (context.state)
      if (context.state.email) {
        async function getMeetingId() {
          const ref = firebase
            .database()
            .ref(
              `users/${replaceInvalid(
                authentication.currentUser
                  ? replaceInvalid(authentication.currentUser?.email)
                  : ""
              )}/contacts/${context.state.email}`
            );

          await ref.once("value", (snapshot) => {
            setMeetingRoom(snapshot.val());
          });
        }
        getMeetingId();
      } else {
        // set meeting room to the stored meeting room if it is a group
        if (!meetingRoom) setMeetingRoom(context.state.meetingRoom);
      }
  }, [
    authentication.currentUser?.email,
    context.state.email,
    context.state.createdAt,
  ]);
  useEffect(() => {
    if (context.state.type === "contact") {
      let ref = firebase.database().ref(`users/${context.state.email}`);

      ref.on("child_changed", (snapshot) => {
        if (snapshot.key === "online") {
          set_current_status(
            snapshot.val().current === true
              ? "Online"
              : offlineString(snapshot.val().current)
          );
        }
      });
      return () => {
        ref.off("child_changed");
      };
    }
  }, []);
  // send a message
  function send() {
    // if reply isn't opened, we dont account for it, else we define a reply object
    const replyObj = reply.isClosed()
      ? ""
      : {
          username: reply.getUsername(),
          message: reply.getMessage(),
          owner: reply.getEmail(),
          type: reply.getType(),
          link: reply.getLink(),
        };
    //if reply is open, close it
    if (!reply.isClosed()) {
      reply.close();
    }
    //create a new text type, defined in messageTypeTemplates in helperfiles, that creates an object to be posted to the db
    const message = new Text(
      replaceInvalid(authentication.currentUser?.email),
      replyObj,
      messageRef.current.value
    );
    //this defines where we send the message to depending on the type of contact this is
    let path = context.state.email
      ? `/contacts/${meetingRoom}/messages`
      : `/groups/${meetingRoom}/messages`;
    const sendRef = firebase
      .database()
      .ref(path)
      .child(firebase.firestore.Timestamp.now().seconds * -1);

    sendRef.set(message.message);
    //update message, so that we dont need to use child added in chat, the data here is very useless
    sendRef.update({ data: { d: false } });

    //clear message
    if (messageRef.current) {
      messageRef.current.value = "";
    }
  }
  //if you click enter, and the message is focused, and the lenght is not 0, submit the message
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
      {/* render the nav of page */}
      <div
        className={external.top + " " + external.darkGray + " " + classes.nav}
      >
        <div className={external.pp + " " + classes.ppUpdated}>
          {/* render the profile picture of user */}
          <div className={external.img} style={{ overflow: "hidden" }}>
            <img
              src={context.state.url}
              alt="contacts icons"
              className={classes.pp}
            />
          </div>
          {/* render the username or ggrouptitle */}
          <div className={classes.userInfo}>
            <div className={classes.username}>
              {context.state.username
                ? context.state.username
                : context.state.groupTitle}
            </div>
            {/* render status or members of the group */}
            <div className={classes.onlineStat}>
              {context.state.type === "contact"
                ? current_status
                : context.state.users
                    .map((curr) => {
                      return curr[1];
                    })
                    .toString()
                    .replaceAll(",", ", ")}
            </div>
          </div>
        </div>

        {/* render the navoptions, search and dropdown on chat page nav */}
        {/* <div className={classes.navOptions}>
          <i className="fa fa-search" aria-hidden="true"></i>
        </div> */}
      </div>

      <BackgroundChat
        shouldNotDecreaseHeight={reply.isClosed()}
        settings={authentication.settings}
      />
      {/* if reply, decreaseHeight of text section - body    */}
      <div
        className={
          classes.body + " " + (reply.isClosed() ? "" : classes.decreaseHeight)
        }
        // onscroll check to see if we need to scroll to bottom of page or top of screen and so on
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
          myEmail={
            authentication.currentUser
              ? replaceInvalid(authentication.currentUser?.email)
              : ""
          }
          show={show}
          setShow={setShow}
          bodyRef={bodyRef}
          shouldScrollToBottom={shouldScrollToBottom}
          setScrollToBottom={setScrollToBottom}
          track={context.rerender}
          key={"chat"}
          type={context.state.type}
          length={context.state.email ? 1 : context.state.users.length - 1}
          users={context.state.users}
        />
      </div>
      <div>
        {/* if reply, render reply */}
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
            key={
              context.state.email
                ? context.state.email
                : context.state.createdAt
            }
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

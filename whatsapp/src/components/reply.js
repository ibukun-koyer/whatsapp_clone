import classes from "./reply.module.css";
import external from "./chatPage.module.css";
import hover from "./hover.module.css";
import { Fragment } from "react";
import { useHover } from "../context/hoverContext";
import DropDownForMessage from "./dropDownForMessge";

function Reply({
  reply,
  myEmail,
  currentlyClicked,
  setCurrentlyClicked,
  createdAt,
  meetingRoom,
  yourEmail,
  message,
  type,
  link,
  messages,
  contactType,
}) {
  const hoverExternal = useHover();
  //start of reference

  //end of reference
  return (
    <Fragment>
      {reply === "" ? null : (
        <div className={classes.replySec} style={{ paddingRight: "5rem" }}>
          <div
            className={
              external.replyUsername +
              " " +
              (reply.owner === myEmail ? external.blueText : external.greenText)
            }
          >
            {reply.username}
          </div>
          <div className={external.replyMessage}>
            {/* {reply.message.slice(0, 300)} */}
            {reply.type === "image" ? (
              <span>
                <i
                  className="fa fa-camera"
                  style={{ padding: "0", fontSize: "1rem", margin: "0" }}
                ></i>{" "}
                <span>
                  <img
                    src={reply.link}
                    alt={" reply"}
                    className={external.displayMediaSmall}
                  />
                </span>
              </span>
            ) : reply.type === "video" ? (
              <span>
                <i
                  className="fa fa-video-camera"
                  aria-hidden="true"
                  style={{ padding: "0", fontSize: "1rem", margin: "0" }}
                ></i>{" "}
                <video
                  src={reply.link}
                  alt={"image reply"}
                  className={external.displayMediaSmall}
                >
                  Not supported on your browser
                </video>
              </span>
            ) : null}
            {reply.message?.slice(0, 300)}
            {!reply.message && (reply.type === "image" ? "Photo" : "Video")}
          </div>
          <div
            className={
              external.replyBorder +
              " " +
              (reply.owner === myEmail ? external.blueBkg : external.greenBkg)
            }
          ></div>
          {hoverExternal.publicHover ? (
            <div className={hover.Hblur}>
              <div className={hover.dropDownPrompt}>
                <DropDownForMessage
                  currentlyClicked={currentlyClicked}
                  setCurrentlyClicked={setCurrentlyClicked}
                  createdAt={createdAt}
                  meetingRoom={meetingRoom}
                  myEmail={myEmail}
                  yourEmail={yourEmail}
                  message={message}
                  exceptionSubtractionX={160}
                  type={type}
                  link={link}
                  messages={messages}
                  contactType={contactType}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Fragment>
  );
}
export default Reply;

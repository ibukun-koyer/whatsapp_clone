import { useState, useEffect } from "react";
import classes from "./chat.module.css";
import DropDownForMessage from "./dropDownForMessge";
import { useHover } from "../context/hoverContext";
function MessageWrap({
  children,
  messages,
  prev,
  ptrToPrev,
  createdAt,
  myEmail,
  currentlyClicked,
  setCurrentlyClicked,
  meetingRoom,
  contactType,
}) {
  const hoverExternal = useHover();
  const [shouldShowHover, setHover] = useState(false);
  useEffect(() => {
    if (currentlyClicked !== createdAt) {
      setHover(false);
    }
  }, [currentlyClicked, createdAt]);
  useEffect(() => {
    if (
      messages[createdAt].reply !== "" ||
      messages[createdAt].type !== "text"
    ) {
      hoverExternal.setPublicHover(shouldShowHover);
    }
  }, [shouldShowHover, createdAt, hoverExternal, messages]);
  return (
    <span
      className={
        messages[createdAt].createdBy === myEmail
          ? classes.myMessageFloat +
            " " +
            (prev === ptrToPrev ? null : classes.myMessageFloatTri)
          : classes.yourMessageFloat +
            " " +
            (prev === ptrToPrev ? null : classes.yourMessageFloatTri)
      }
      style={{ position: "relative" }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        if (currentlyClicked !== createdAt) {
          setHover(false);
        }
      }}
    >
      {shouldShowHover &&
      messages[createdAt].reply === "" &&
      messages[createdAt].type === "text" ? (
        <div className={classes.blur}>
          <div className={classes.dropDownPrompt}>
            <DropDownForMessage
              currentlyClicked={currentlyClicked}
              setCurrentlyClicked={setCurrentlyClicked}
              createdAt={createdAt}
              meetingRoom={meetingRoom}
              myEmail={myEmail}
              yourEmail={messages[createdAt].createdBy}
              message={messages[createdAt].message}
              type={messages[createdAt].type}
              link=""
              messages={messages}
              contactType={contactType}
            />
          </div>
        </div>
      ) : null}
      {children}
    </span>
  );
}
export default MessageWrap;

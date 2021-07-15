import classes from "./showContacts.module.css";
import ownClass from "./contactInfo.module.css";

import { defaultUrl } from "./helperFiles/globals";
import { useEffect, useState } from "react";
import DropDownForMessage from "./dropDownForMessge";
import { useScreen2 } from "../context/screen2Context";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";

import { useAuth } from "../context/authContext";

function RenderMessageUpdate({
  imageUrl,
  displayName,
  text,
  date,
  setCurrentlyClicked,
  currentlyClicked,
  meetingRoom,
  type,
  email,
  online,
  status,
}) {
  const [hover, setHover] = useState(false);
  const context = useScreen2();
  const authentication = useAuth();
  useEffect(() => {
    if (currentlyClicked !== meetingRoom) {
      setHover(false);
    }
  }, [currentlyClicked, meetingRoom]);
  return (
    <div
      style={{ display: "flex" }}
      className={ownClass.newFocus}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        if (currentlyClicked !== meetingRoom) {
          setHover(false);
        }
      }}
      onClick={() => {
        if (type === "contact") {
          context.setPage({
            type: "contact",
            username: displayName,
            email,
            url: imageUrl,
            status,
            online,
          });
        }
      }}
      //   onClick={handleClick}
    >
      <div className={classes.new + " " + ownClass.updatedIcon}>
        <div className={ownClass.icon} style={{ backgroundColor: "#dfe5e7" }}>
          <img
            src={imageUrl}
            alt="user icon"
            style={{
              // filter: "invert(0)",
              objectFit: "contain",
              width: defaultUrl === imageUrl ? "80%" : "100%",
              filter: defaultUrl === imageUrl ? "brightness(5)" : "none",
            }}
          />
        </div>
      </div>
      <div className={classes.new + " " + ownClass.updatedText}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className={ownClass.username + " " + ownClass.ellipsis}>
            {displayName}
          </span>
          <span
            className={ownClass.status + " " + ownClass.ellipsis}
            style={{ color: "grey" }}
          >
            {text}
          </span>
        </div>
      </div>
      <div
        className={classes.new + " " + ownClass.updatedText}
        style={{ width: "5rem", padding: "0" }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className={ownClass.date}
            style={{ padding: "0", color: "grey" }}
          >
            {date}
          </span>
          <span
            style={{ width: "100%", height: "1.5rem", textAlign: "center" }}
          >
            {hover ? (
              <DropDownForMessage
                currentlyClicked={currentlyClicked}
                setCurrentlyClicked={setCurrentlyClicked}
                createdAt={meetingRoom}
                meetingRoom={meetingRoom}
                externalArr={["Clear chat"]}
                myEmail={replaceInvalid(authentication.currentUser.email)}
              />
            ) : null}
          </span>
        </div>
      </div>
    </div>
  );
}
export default RenderMessageUpdate;

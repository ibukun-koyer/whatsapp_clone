import classes from "./showContacts.module.css";
import ownClass from "./contactInfo.module.css";
import { useScreen2 } from "../context/screen2Context";
// import { useRef } from "react";
function ContactInfo({
  email,
  username,
  status,
  url,
  onClick,
  letterDes,
  online,
  fxnId,
}) {
  //   const isAdded = useRef();

  const context = useScreen2();
  const handleClick = () => {
    // console.log(deleted);
    if (fxnId === 1) {
      onClick((prev) => {
        const bool = prev.some((curr) => {
          if (curr.email === email) {
            return true;
          }
          return false;
        });
        if (bool === false) {
          return [...prev, { email, username, url }];
        } else {
          return prev;
        }
      });
      //   isAdded.current = true;
    }
    if (fxnId === 2) {
      console.log(email);
      context.setPage({
        type: fxnId === 2 ? "contact" : "group",
        username,
        email,
        url,
        status,
        online,
      });
      onClick();
    }
  };
  //statefulness should be defined when transitioning from this page to the next page which takes the emails of the users
  return (
    <div>
      {" "}
      {letterDes.show === true ? (
        <div className={ownClass.des}>{letterDes.curr}</div>
      ) : null}
      <div
        style={{ display: "flex" }}
        className={ownClass.newFocus}
        onClick={handleClick}
      >
        <div className={classes.new + " " + ownClass.updatedIcon}>
          <div className={ownClass.icon}>
            <img src={url} alt="user icon" style={{ filter: "invert(0)" }} />
          </div>
        </div>
        <div className={classes.new + " " + ownClass.updatedText}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className={ownClass.username}>{username}</span>
            <span className={ownClass.status}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContactInfo;

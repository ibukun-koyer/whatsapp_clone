import { useState } from "react";
import classes from "./groupInfo.module.css";

import { defaultUrl } from "./helperFiles/globals";
function DisplayImage({
  imageUrl,
  handleImageChange,
  text,
  textAppearsOnHover,
}) {
  const [mouseLoc, setMouseLoc] = useState("out");
  return (
    <div className={classes.wrapImage}>
      <div className={classes.userImage}>
        <img
          src={imageUrl}
          alt="groupIcon"
          className={
            classes.image +
            " " +
            (defaultUrl === imageUrl ? classes.initializeDefault : "")
          }
        />
      </div>

      <input
        className={classes.imagePicker}
        id="upload"
        type="file"
        accept="image/*"
        multiple={false}
        onChange={handleImageChange}
        onMouseEnter={() => {
          if (textAppearsOnHover) setMouseLoc("in");
        }}
        onMouseLeave={() => {
          if (textAppearsOnHover) setMouseLoc("out");
        }}
      />

      <div
        className={`${classes.des} ${
          textAppearsOnHover && mouseLoc === "in"
            ? classes.in
            : textAppearsOnHover
            ? classes.out
            : classes.in
        }`}
      >
        <i className={`fa fa-camera ${classes.camIcon}`} aria-hidden="true"></i>
        <div
          style={{
            width: "6rem",
            textAlign: "center",
            fontSize: "0.8rem",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
export default DisplayImage;

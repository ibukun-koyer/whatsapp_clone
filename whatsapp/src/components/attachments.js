import ImageSVG from "./SVG/imageSVG";
// import ContactSVG from "./SVG/contactSVG";
import { useState } from "react";
import { Fragment } from "react";
import classes from "./attachments.module.css";
function Attachments({ meetingRoom }) {
  const [showAttach, setShowAttach] = useState(undefined);
  return (
    <Fragment>
      <i
        className={`fa fa-paperclip ${showAttach ? classes.on : classes.off} ${
          classes.relative
        }`}
        aria-hidden="true"
        onClick={(e) => {
          setShowAttach((prev) => !prev);
        }}
        title={"attach"}
      >
        <div title="">
          {showAttach ? (
            <ImageSVG
              className={classes.image}
              incoming={true}
              meetingRoom={meetingRoom}
            />
          ) : (
            <ImageSVG
              className={classes.image}
              incoming={showAttach}
              meetingRoom={meetingRoom}
            />
          )}
       
        </div>
      </i>
    </Fragment>
  );
}
export default Attachments;

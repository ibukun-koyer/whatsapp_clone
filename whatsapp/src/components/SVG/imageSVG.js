import { Fragment, useRef, useState } from "react";
import classes from "./titleSVG/hoverAnimation.module.css";
import AttachmentSVG from "./attachmentSVG";
import { onImageChange } from "../helperFiles/imageHandler";

import Alert from "../alert";
import { useScreen2 } from "../../context/screen2Context";
function ImageSVG({ className, incoming, meetingRoom }) {
  const screen2 = useScreen2();
  const [imageError, setImageError] = useState("");
  const fileSelect = useRef();
  function handleClick(e) {
    e.stopPropagation();
    fileSelect.current.click();
  }
  function handleImageSelected(e) {
    const list_of_files = [];
    let broken = false;
    for (let i of e.target.files) {
      const fileObj = i;
      let url = onImageChange(fileObj, setImageError);
      if (url) {
        list_of_files.push([url, i.type.slice(0, 5)]);
      } else {
        broken = true;
        break;
      }
    }
    if (!broken) {
      screen2.setMeetingRoom(meetingRoom);
      screen2.setImageUrl(list_of_files);
    }

    // , screen2.setImageUrl
  }
  return (
    <Fragment>
      {imageError === "" ? null : (
        <Alert
          color={"red"}
          header={"Oops, an error occured"}
          msg={imageError}
          onClick={() => setImageError("")}
          closeTxt="close"
        />
      )}
      <AttachmentSVG
        className={
          className + " " + (incoming ? classes.svg2 : classes.svg2Out)
        }
        incoming={incoming}
        text={"Photos & Videos"}
        position={5}
        onClick={handleClick}
      >
        {" "}
        <defs>
          <circle id="image-SVGID_1_" cx="26.5" cy="26.5" r="26.5"></circle>
        </defs>
        <clipPath id="image-SVGID_2_">
          <use xlinkHref="#image-SVGID_1_" overflow="visible"></use>
        </clipPath>
        <g clipPath="url(#image-SVGID_2_)">
          <path
            fill="#AC44CF"
            d="M26.5-1.1C11.9-1.1-1.1 5.6-1.1 27.6h55.2c-.1-19-13-28.7-27.6-28.7z"
          ></path>
          <path
            fill="#BF59CF"
            d="M53 26.5H-1.1c0 14.6 13 27.6 27.6 27.6s27.6-13 27.6-27.6H53z"
          ></path>
          <path fill="#AC44CF" d="M17 24.5h18v9H17z"></path>
        </g>
        <g fill="#F5F5F5">
          <path
            id="svg-image"
            d="M18.318 18.25h16.364c.863 0 1.727.827 1.811 1.696l.007.137v12.834c0 .871-.82 1.741-1.682 1.826l-.136.007H18.318a1.83 1.83 0 0 1-1.812-1.684l-.006-.149V20.083c0-.87.82-1.741 1.682-1.826l.136-.007h16.364zm5.081 8.22l-3.781 5.044c-.269.355-.052.736.39.736h12.955c.442-.011.701-.402.421-.758l-2.682-3.449a.54.54 0 0 0-.841-.011l-2.262 2.727-3.339-4.3a.54.54 0 0 0-.861.011zm8.351-5.22a1.75 1.75 0 1 0 .001 3.501 1.75 1.75 0 0 0-.001-3.501z"
          ></path>
        </g>
      </AttachmentSVG>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileSelect}
        accept="image/* video/*"
        multiple
        onChange={handleImageSelected}
      />
    </Fragment>
  );
}
export default ImageSVG;

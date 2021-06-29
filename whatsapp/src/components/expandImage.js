import { useState } from "react";
import { useFull } from "../context/requestFullScreen";
import classes from "./addNewContact.module.css";
import expand from "./expand.module.css";
import useKey from "./hooks/useKey";

function ExpandImage() {
  const fullscreen = useFull();
  const data = fullscreen.getTransferedData();
  const [animateOff, setAnimateOff] = useState(false);

  useKey("Escape", () => {
    setAnimateOff(true);
  });
  return (
    <div
      className={
        classes.fullScreen + " " + (animateOff ? classes.animateOff : "")
      }
      key={animateOff}
      onAnimationEnd={(e) => {
        if (animateOff) {
          fullscreen.setDataTransfer({});
          fullscreen.provideFullScreen(0);
        }
      }}
    >
      {data.type === "image" ? (
        <img src={data.url} className={expand.image} alt="display" />
      ) : (
        <video src={data.url} className={expand.vid} controls>
          The browser does not support videos.
        </video>
      )}
      <i
        className={`fa fa-times-thin fa-2x ${expand.close}`}
        aria-hidden="true"
        onClick={(e) => {
          setAnimateOff(true);
        }}
      ></i>
      {data.caption ? (
        <div className={expand.caption}>{data.caption}</div>
      ) : null}
    </div>
  );
}
export default ExpandImage;

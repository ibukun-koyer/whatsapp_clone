import classes from "./chat.module.css";
import DropDownForMessage from "./dropDownForMessge";
import hover from "./hover.module.css";
import { useHover } from "../context/hoverContext";
import { useFull } from "../context/requestFullScreen";

function InnerImage({
  reply,
  myEmail,
  currentlyClicked,
  setCurrentlyClicked,
  createdAt,
  meetingRoom,
  yourEmail,
  messages,
  type,
  link,
  caption,
}) {
  const fullscreen = useFull();
  const hoverExternal = useHover();

  function handleExpand() {
    fullscreen.setDataTransfer({ url: link, type, caption });
    fullscreen.provideFullScreen(2);
  }
  return (
    <div style={{ position: "relative" }}>
      {type === "image" ? (
        <img
          src={link}
          className={classes.imageType}
          onClick={handleExpand}
          alt="message type"
        />
      ) : (
        <div className={classes.wrapVid}>
          <video src={link} className={classes.vid}>
            The browser does not support videos.
          </video>
          <i
            className={`fa fa-play ${classes.playIcon}`}
            aria-hidden="true"
            onClick={handleExpand}
          ></i>
        </div>
      )}
      {hoverExternal.publicHover && reply === "" ? (
        <div className={hover.Hblur}>
          <div className={hover.dropDownPrompt}>
            <DropDownForMessage
              currentlyClicked={currentlyClicked}
              setCurrentlyClicked={setCurrentlyClicked}
              createdAt={createdAt}
              meetingRoom={meetingRoom}
              myEmail={myEmail}
              yourEmail={yourEmail}
              message={caption}
              exceptionSubtractionX={160}
              type={type}
              link={link}
              messages={messages}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default InnerImage;

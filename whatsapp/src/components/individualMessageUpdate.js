import { useAuth } from "../context/authContext";
import { date } from "./helperFiles/calculateDate";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import RenderMessageUpdate from "./renderMessageUpdate";
import ReadSVG from "./SVG/readSVG";

const cutOffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const today = new Date();

const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
function IndividualMessageUpdate({
  indivInfo,
  currentlyClicked,
  setCurrentlyClicked,
}) {
  //questions to answer
  //2. display name✅
  //1. imageUrl✅
  //3. message✅
  //4. date✅

  const authentication = useAuth();
  const { message, meetingRoom, url, type, createdAt } = indivInfo;

  let displayName =
    type === "contact" ? indivInfo.username : indivInfo.groupTitle;
  let messageDate = date(createdAt, today, yesterday, cutOffDate);
  const myEmail = replaceInvalid(authentication.currentUser.email);
  let messageKey = Object.keys(message)[0];

  let innerText = (
    <span>
      {" "}
      {message[messageKey].type === "image" ? (
        <span>
          <i
            className="fa fa-camera"
            style={{ padding: "0", fontSize: "1rem", margin: "0" }}
          ></i>{" "}
        </span>
      ) : message[messageKey].type === "video" ? (
        <span>
          <i
            className="fa fa-video-camera"
            aria-hidden="true"
            style={{ padding: "0", fontSize: "1rem", margin: "0" }}
          ></i>{" "}
        </span>
      ) : null}
      {message[messageKey].message?.slice(0, 75)}
      {message[messageKey].messageCaption?.slice(0, 75)}
      {!message[messageKey].message &&
        !message[messageKey].messageCaption &&
        (message[messageKey].type === "image" ? "Photo" : "Video")}
    </span>
  );

  let baseMessage =
    myEmail === indivInfo.createdBy
      ? `You created group "${displayName}"`
      : `You were added to "${displayName}"`;

  if (messageKey !== "cleared") {
    if (
      message[messageKey].deletedBy &&
      Object.values(message[messageKey].deletedBy).indexOf(myEmail) !== -1
    ) {
      baseMessage = (
        <span>
          <i className="fa fa-ban" aria-hidden="true"></i>{" "}
          <i>You deleted this message</i>
        </span>
      );
    } else if (message[messageKey].createdBy === myEmail) {
      baseMessage = (
        <span>
          <ReadSVG read={message[messageKey].readRecipient === "read"} />{" "}
          {innerText}
        </span>
      );
    } else {
      if (message[messageKey].readRecipient === "read") {
        baseMessage = innerText;
      } else {
        baseMessage = <b style={{ color: "rgb(30,30,30" }}>{innerText}</b>;
        displayName = <b style={{ color: "rgb(30,30,30" }}>{displayName}</b>;
      }
    }
  }
  // console.log(baseMessage);
  return (
    <RenderMessageUpdate
      imageUrl={url}
      text={baseMessage}
      displayName={displayName}
      date={messageDate}
      currentlyClicked={currentlyClicked}
      setCurrentlyClicked={setCurrentlyClicked}
      meetingRoom={meetingRoom}
      type={type}
      //   contact variables
      email={indivInfo.email}
      online={indivInfo.online}
      status={indivInfo.status}
    />
  );
}
export default IndividualMessageUpdate;

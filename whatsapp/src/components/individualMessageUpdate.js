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
  // destructuring some variables useful for this message
  const { message, meetingRoom, url, type, createdAt } = indivInfo;

  // the display name is either contacts name or the groupTitle
  let displayName =
    type === "contact" ? indivInfo.username : indivInfo.groupTitle;
  //unaffected display name, not affected by bold changes
  let display_name_unaffected = displayName;
  // calculate date based on a function specified in helperfiles
  let messageDate = date(createdAt, today, yesterday, cutOffDate);
  const myEmail = authentication.currentUser
    ? replaceInvalid(authentication.currentUser.email)
    : "";
  // the key to the message, since message is an obj
  let messageKey = Object.keys(message)[0];

  // innerText based on what type of message this is

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

  // initially, we assume that the string to be displayed is you created group or you were added to

  let baseMessage =
    myEmail === indivInfo.createdBy
      ? `You created group "${displayName}"`
      : `You were added to "${displayName}"`;

  //if the key is cleared, it means its an empty group contact, then the message will be base message, else, we change message
  if (messageKey !== "cleared") {
    // if i deleted the message
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
    }
    // if i created the message, then i want to know if it has been read or not
    else if (message[messageKey].createdBy === myEmail) {
      baseMessage = (
        <span>
          <ReadSVG read={message[messageKey].readRecipient === "read"} />{" "}
          {innerText}
        </span>
      );
    } //else if i did not create the message
    else {

      if (
        message[messageKey].readRecipient === "read" ||
        (message[messageKey].seenBy &&
          message[messageKey].seenBy.indexOf(myEmail) !== -1)
      ) {
        baseMessage = innerText;
      } else {
        baseMessage = (
          <b style={{ color: "var(--messageReceivedBoldColor)" }}>
            {innerText}
          </b>
        );

        displayName = (
          <b style={{ color: "var(--messageReceivedBoldColor)" }}>
            {displayName}
          </b>
        );
      }
    }
  }

  return (
    <RenderMessageUpdate
      imageUrl={url}
      text={baseMessage}
      displayName={displayName}
      display_name_unaffected={display_name_unaffected}
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

import classes from "./chat.module.css";
import ReadSVG from "./SVG/readSVG";

function InnerText({ myEmail, messages, createdAt, time, type, users }) {
  let thisUsersName;
  if (type === "group") {
    thisUsersName = users.reduce((prev, curr) => {
      console.log(curr[0]);
      if (curr[0] === messages[createdAt].createdBy) {
        // console.log(myEmail, curr[0]);
        if (myEmail !== curr[0]) return curr[1];
        else return "Me";
      }
      return prev;
    }, undefined);
  }

  console.log(thisUsersName);
  const message = messages[createdAt].message
    ? messages[createdAt].message
    : messages[createdAt].messageCaption;

  let startText;
  let link;
  let linkWithA;
  let endText;
  if (message) {
    let index = message.indexOf("http");
    startText = message.slice(0, index < 0 ? message.length : index);

    link =
      index >= 0
        ? message.slice(
            index,
            message.indexOf(" ", index) < 0
              ? message.length
              : message.indexOf(" ", index)
          )
        : "";

    linkWithA = (
      <span>
        <a href={link} style={{ color: "#00a5f4" }}>
          {link}
        </a>
      </span>
    );
    if (index >= 0) {
      endText = message.slice(
        message.indexOf(" ", index) >= 0
          ? message.indexOf(" ", index)
          : message.length
      );
    }
  }

  let messageTAG = (
    <span>
      {message && startText}
      {message && linkWithA}
      {message && endText}
    </span>
  );
  if (messages[createdAt].messageCaption) {
    messageTAG = <div>{messageTAG}</div>;
  }
  return (
    <span>
      {type === "group" ? (
        <div style={{ color: "grey", fontSize: "0.7rem" }}>{thisUsersName}</div>
      ) : null}
      {messageTAG}
      <span className={classes.wrapTime}>
        <span className={classes.time}>
          {time}{" "}
          {messages[createdAt].createdBy === myEmail ? (
            <ReadSVG read={messages[createdAt].readRecipient === "read"} />
          ) : null}
        </span>
      </span>
    </span>
  );
}
export default InnerText;

import classes from "./chat.module.css";
import ReadSVG from "./SVG/readSVG";

function InnerText({ myEmail, messages, createdAt, time, type, users }) {
  let thisUsersName;
  if (type === "group") {
    thisUsersName = users.reduce((prev, curr) => {
      if (curr[0] === messages[createdAt].createdBy) {
        if (myEmail !== curr[0]) return curr[1];
        else return "Me";
      }
      return prev;
    }, undefined);
  }

  const message = messages[createdAt].message
    ? messages[createdAt].message
    : messages[createdAt].messageCaption;

  let updatedText = message;
  if (message) {
    let arr_of_link = [];
    let current_str = "";

    let start = null;
    let end = null;
    let being_stored = false;
    let urlValidate = (str, i) => {
      return str.substr(i, 4) === "http";
    };
    let refreshCond = () => {
      return current_str !== "" && start !== null && start !== end;
    };
    let cleanUp = (i) => {
      start = i;
      end = null;
      current_str = "";
    };
    for (let i = 0; i < message.length; i++) {
      let valid = urlValidate(message, i);
      if (start === null) {
        start = i;
      }

      if (valid) {
        end = i;
        if (refreshCond()) {
          arr_of_link.push({ str: current_str, start, end, type: 0 });
        }
        cleanUp(i);

        being_stored = true;
      }
      if (message[i] === " " && being_stored) {
        being_stored = false;
        if (refreshCond()) {
          end = i;
          arr_of_link.push({ str: current_str, start, end, type: 1 });
        }
        cleanUp(i);
      }
      current_str += message[i];
      if (i + 1 === message.length) {
        if (refreshCond) {
          end = i;
          if (being_stored)
            arr_of_link.push({ str: current_str, start, end, type: 1 });
          else arr_of_link.push({ str: current_str, start, end, type: 0 });
        }
      }
    }

    updatedText = (
      <span>
        {arr_of_link.map((subText, index) => {
          if (subText.type === 0) {
            return <span key={index}>{subText.str}</span>;
          } else {
            return (
              <a
                rel="noreferrer"
                href={subText.str}
                style={{ color: "var(--myReplyBkg)" }}
                key={index}
                target="_blank"
              >
                {subText.str}
              </a>
            );
          }
        })}
      </span>
    );
  }

  let messageTAG = <span>{message && updatedText}</span>;
  if (messages[createdAt].messageCaption) {
    messageTAG = <div>{messageTAG}</div>;
  }
  return (
    <span>
      {type === "group" ? (
        <div style={{ color: "var(--iconColor)", fontSize: "0.7rem" }}>
          {thisUsersName}
        </div>
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

import classes from "./chat.module.css";
import { Fragment } from "react";
import InnerText from "./innerText";
import MessageBkg from "./messageBkg";
import Reply from "./reply";
import { HoverProvider } from "../context/hoverContext";
import InnerImage from "./innerImage";
function IndividualMessages({
  messages,
  myEmail,
  prev,
  createdAt,
  printedDate,
  ptrToPrev,
  time,
  currentlyClicked,
  setCurrentlyClicked,
  meetingRoom,
}) {
  // if (messages[createdAt].type === "text") {
  return (
    <Fragment>
      {/* date section */}
      {printedDate === "" ? null : (
        <div className={classes.dateSec}>
          <div className={classes.date}>{printedDate}</div>
        </div>
      )}
      {/* assign a 100% width to messages and then set left or right align */}
      <div
        className={
          classes.message +
          " " +
          (messages[createdAt].createdBy === myEmail
            ? classes.mine
            : classes.yours)
        }
        key={createdAt}
      >
        {/* message bkg, white or green color along with its display fixes  */}
        <HoverProvider>
          <MessageBkg
            messages={messages}
            prev={prev}
            ptrToPrev={ptrToPrev}
            createdAt={createdAt}
            myEmail={myEmail}
            currentlyClicked={currentlyClicked}
            setCurrentlyClicked={setCurrentlyClicked}
            meetingRoom={meetingRoom}
          >
            <Reply
              reply={messages[createdAt].reply}
              myEmail={myEmail}
              currentlyClicked={currentlyClicked}
              setCurrentlyClicked={setCurrentlyClicked}
              createdAt={createdAt}
              meetingRoom={meetingRoom}
              yourEmail={messages[createdAt].createdBy}
              message={
                messages[createdAt].message
                  ? messages[createdAt].message
                  : messages[createdAt].messageCaption
              }
              type={messages[createdAt].type}
              link={messages[createdAt].links ? messages[createdAt].links : ""}
              messages={messages}
            />
            {/* 
              link, */}
            {/* contains all the inner text and how they are ordered. time, message and read receipt */}
            {messages[createdAt].type === "image" ||
            messages[createdAt].type === "video" ? (
              <InnerImage
                reply={messages[createdAt].reply}
                myEmail={myEmail}
                currentlyClicked={currentlyClicked}
                setCurrentlyClicked={setCurrentlyClicked}
                createdAt={createdAt}
                meetingRoom={meetingRoom}
                yourEmail={messages[createdAt].createdBy}
                // message={messages[createdAt].message}
                type={messages[createdAt].type}
                link={
                  messages[createdAt].links ? messages[createdAt].links : ""
                }
                caption={messages[createdAt].messageCaption}
                messages={messages}
              />
            ) : null}

            <InnerText
              myEmail={myEmail}
              messages={messages}
              createdAt={createdAt}
              time={time}
            />
          </MessageBkg>
        </HoverProvider>
      </div>
    </Fragment>
  );
  // }
}
export default IndividualMessages;

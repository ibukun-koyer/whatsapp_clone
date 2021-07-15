import { Fragment, useState } from "react";
// import classes from "./chat.module.css";
import IndividualMessages from "./individualMessages";
import { calcMessageEssentialData } from "./helperFiles/calcMessageEssentialData";
function MapMessage({ MessagesArr, messages, myEmail, meetingRoom }) {
  const [currentlyClicked, setCurrentlyClicked] = useState(undefined);

  const cutOffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const today = new Date();
  const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  let currDate;
  let prevDate;
  let prev = null;
  return (
    <Fragment>
      {MessagesArr.map((createdAt, index) => {
        if (
          !messages[createdAt].deletedBy ||
          Object.values(messages[createdAt].deletedBy).indexOf(myEmail) === -1
        ) {
          const [
            printedDate,
            ptrToPrev,
            time,
            updatedPrev,
            updatedPrevDate,
            updatedCurrDate,
          ] = calcMessageEssentialData(
            prev,
            messages,
            createdAt,
            prevDate,
            currDate,
            today,
            yesterday,
            cutOffDate
          );
          prev = updatedPrev;
          prevDate = updatedPrevDate;
          currDate = updatedCurrDate;

          return (
            <IndividualMessages
              messages={messages}
              myEmail={myEmail}
              prev={prev}
              createdAt={createdAt}
              key={createdAt}
              printedDate={printedDate}
              ptrToPrev={ptrToPrev}
              time={time}
              currentlyClicked={currentlyClicked}
              setCurrentlyClicked={setCurrentlyClicked}
              meetingRoom={meetingRoom}
            />
          );
        } else {
          return null;
        }
      })}
    </Fragment>
  );
}
export default MapMessage;

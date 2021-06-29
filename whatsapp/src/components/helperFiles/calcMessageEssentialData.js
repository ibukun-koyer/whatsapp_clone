export function calcMessageEssentialData(
  prev,
  messages,
  createdAt,
  prevDate,
  currDate,
  today,
  yesterday,
  cutOffDate
) {
  const daysOfTheWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  //used as a way to check if chat tri is needed
  let ptrToPrev = prev;
  prev = messages[createdAt].createdBy;
  //convert to date Obj
  const absTime = Math.abs(createdAt);
  const timeObj = new Date(absTime * 1000);
  //convert to locale time
  let time = timeObj.toLocaleTimeString();
  time =
    time.slice(0, time.lastIndexOf(":")) +
    time.slice(time.indexOf(" "), time.length);
  //check day
  prevDate = currDate;
  currDate = timeObj;

  //the date printed
  let printedDate = "";
  if (
    !prevDate ||
    currDate.toLocaleDateString() !== prevDate.toLocaleDateString()
  ) {
    if (currDate.toLocaleDateString() === today.toLocaleDateString()) {
      printedDate = "today";
    } else if (
      currDate.toLocaleDateString() === yesterday.toLocaleDateString()
    ) {
      printedDate = "yesterday";
    } else if (currDate > cutOffDate) {
      printedDate = daysOfTheWeek[currDate.getDay()];
    } else {
      printedDate = currDate.toLocaleDateString();
    }
  }

  return [printedDate, ptrToPrev, time, prev, prevDate, currDate];
}

export function date(createdAt, today, yesterday, cutOffDate) {
  const daysOfTheWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  //convert to date Obj
  const absTime = Math.abs(createdAt);
  const timeObj = new Date(absTime * 1000);
  //convert to locale time
  let time = timeObj.toLocaleTimeString();
  time =
    time.slice(0, time.lastIndexOf(":")) +
    time.slice(time.indexOf(" "), time.length);

  //the date printed
  let printedDate = "";

  if (timeObj.toLocaleDateString() === today.toLocaleDateString()) {
    printedDate = time;
  } else if (timeObj.toLocaleDateString() === yesterday.toLocaleDateString()) {
    printedDate = "yesterday";
  } else if (timeObj > cutOffDate) {
    printedDate = daysOfTheWeek[timeObj.getDay()];
  } else {
    printedDate = timeObj.toLocaleDateString();
  }

  return printedDate;
}

import { useState } from "react";
import IndividualMessageUpdate from "./individualMessageUpdate";

function MapUpdates({ storeDS }) {
  // currently clicked is used to know which message has a dropdown, initially, none has a drop down, until the downangle is clicked on hover
  const [currentlyClicked, setCurrentlyClicked] = useState(undefined);

  return (
    <div>
      {/* map the sorted multiindex array */}
      {storeDS.current.sortedOutput().map((curr, index) => {
        if (!curr || curr.hide) {
          return null;
        } else if (curr.createdAt !== 0) {
          // only render if the createdat time is not 0
          return (
            <IndividualMessageUpdate
              indivInfo={curr}
              key={index}
              currentlyClicked={currentlyClicked}
              setCurrentlyClicked={setCurrentlyClicked}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
export default MapUpdates;

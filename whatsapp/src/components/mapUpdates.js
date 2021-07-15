import { useState } from "react";
import IndividualMessageUpdate from "./individualMessageUpdate";

function MapUpdates({ storeDS }) {
  const [currentlyClicked, setCurrentlyClicked] = useState(undefined);

  console.log(storeDS.current.sortedOutput());
  return (
    <div>
      {storeDS.current.sortedOutput().map((curr, index) => {
        if (!curr) {
          return null;
        } else if (curr.createdAt !== 0) {
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

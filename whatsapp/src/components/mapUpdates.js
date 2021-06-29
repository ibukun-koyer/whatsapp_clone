import { useState } from "react";
import IndividualMessageUpdate from "./individualMessageUpdate";

function MapUpdates({ contacts, setContacts, storeDS }) {
  const [currentlyClicked, setCurrentlyClicked] = useState(undefined);
  console.log(storeDS.current);
  const [rerender, setRender] = useState(true);
  console.log(storeDS.current.sortedOutput());
  return (
    <div>
      {storeDS.current.sortedOutput().map((curr, index) => {
        console.log(curr.meetingRoom);
        return (
          <IndividualMessageUpdate
            setContacts={setContacts}
            indivInfo={curr}
            key={curr.meetingRoom}
            currentlyClicked={currentlyClicked}
            setCurrentlyClicked={setCurrentlyClicked}
            contacts={contacts}
            storeDS={storeDS}
            rerender={rerender}
            setRender={setRender}
          />
        );
      })}
    </div>
  );
}
export default MapUpdates;

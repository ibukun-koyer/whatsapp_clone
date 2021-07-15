import { useState } from "react";
import IndividualMessageUpdate from "./individualMessageUpdate";
import { v4 as uuidv4 } from "uuid";

function MapUpdates({ contacts, setContacts, storeDS }) {
  const [currentlyClicked, setCurrentlyClicked] = useState(undefined);

  const [rerender, setRender] = useState(true);

  return (
    <div>
      {storeDS.current.sortedOutput().map((curr, index) => {
        return (
          <IndividualMessageUpdate
            setContacts={setContacts}
            indivInfo={curr}
            key={index}
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

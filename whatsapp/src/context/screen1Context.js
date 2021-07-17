import { createContext, useContext, useEffect, useState } from "react";
import { pageNames } from "../components/helperFiles/globals";
import { replaceInvalid } from "../components/helperFiles/replaceEmailInvalid";
import firebase from "firebase";
import { useAuth } from "./authContext";

const screen1Context = createContext();

export function Screen1Provider({ children }) {
  const [myInfo, setMyInfo] = useState(undefined);
  const authentication = useAuth();
  const [state, setState] = useState({
    prev: pageNames.allMessages,
    curr: pageNames.allMessages,
  });
  function setPage(pageTitle) {
    return setState(pageTitle);
  }

  useEffect(() => {
    if (authentication.currentUser) {
      const myEmail = replaceInvalid(authentication.currentUser.email);
      firebase
        .database()
        .ref(`users/${myEmail}`)
        .once("value", (snapshot) => {
          const { url, username, status } = snapshot.val();

          setMyInfo({ url, username, status });
        });
    }
  }, [authentication.currentUser]);
  const values = {
    myInfo,
    setMyInfo,
    state,
    setPage,
  };
  console.log(myInfo);
  return (
    <screen1Context.Provider value={values}>{children}</screen1Context.Provider>
  );
}
export function useScreen1() {
  return useContext(screen1Context);
}

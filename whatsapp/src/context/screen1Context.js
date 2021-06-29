import { createContext, useContext, useState } from "react";
import { pageNames } from "../components/helperFiles/globals";
const screen1Context = createContext();

export function Screen1Provider({ children }) {
  const [state, setState] = useState({
    prev: pageNames.allMessages,
    curr: pageNames.allMessages,
  });
  function setPage(pageTitle) {
    return setState(pageTitle);
  }
  const values = {
    state,
    setPage,
  };
  return (
    <screen1Context.Provider value={values}>{children}</screen1Context.Provider>
  );
}
export function useScreen1() {
  return useContext(screen1Context);
}

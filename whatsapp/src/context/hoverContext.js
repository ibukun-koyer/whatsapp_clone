import { createContext, useContext, useState } from "react";

const context = createContext();

export function HoverProvider({ children }) {
  const [publicHover, setPub] = useState(false);
  function setPublicHover(bool) {
    setPub(bool);
  }

  const values = {
    setPublicHover,
    publicHover,
  };

  return <context.Provider value={values}>{children}</context.Provider>;
}
export function useHover() {
  return useContext(context);
}

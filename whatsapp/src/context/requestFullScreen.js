import { createContext, useContext, useState, useRef } from "react";

const requestFullScreen = createContext();

export function FullScreenProvider({ children }) {
  const [query, showQuery] = useState(0);
  function provideFullScreen(option) {
    return showQuery(option);
  }
  const dataTransfer = useRef();
  function setDataTransfer(data) {
    dataTransfer.current = data;
  }
  function getTransferedData() {
    return dataTransfer.current;
  }
  const values = {
    showFull: query,
    provideFullScreen,
    setDataTransfer,
    getTransferedData,
  };
  return (
    <requestFullScreen.Provider value={values}>
      {children}
    </requestFullScreen.Provider>
  );
}
export function useFull() {
  return useContext(requestFullScreen);
}

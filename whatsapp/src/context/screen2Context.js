import { createContext, useContext, useRef, useState } from "react";

const context = createContext();

export function Screen2Provider({ children }) {
  const [contactInfo, setContactInfo] = useState({
    type: "",
    username: "",
    email: "",
    url: "",
    status: "",
    online: "",
    createdAt: "",
    createdBy: "",
    groupTitle: "",
    users: [],
    meetingRoom: "",
  });
  const [changed, setChanged] = useState(null);
  const [rerender, setReRender] = useState(undefined);
  const [imageUrl, setUrl] = useState([]);
  const urlFor = useRef();

  function setMeetingRoom(meetingRoom) {
    urlFor.current = meetingRoom;
  }
  function getMeetingRoom() {
    return urlFor.current;
  }
  function setImageUrl(url) {
    setUrl(url);
  }
  function setContact(id) {
    return setContactInfo(id);
  }

  function setRender(render) {
    return setReRender(render);
  }
  const values = {
    imageUrl,
    setImageUrl,
    setPage: setContact,
    state: contactInfo,
    getMeetingRoom,
    setMeetingRoom,
    rerender,
    setRender,
    changed,
    setChanged,
  };
  return <context.Provider value={values}>{children}</context.Provider>;
}
export function useScreen2() {
  return useContext(context);
}

import { createContext, useContext, useState } from "react";

const context = createContext();

export function ReplyProvider({ children }) {
  const falseReply = {
    username: "",
    message: "",
    owner: "",
    email: "",
    type: "",
    link: "",
  };
  const [reply, set] = useState(falseReply);
  function setReply(username, message, owner, email, type, link) {
    set({ username, message, owner, email, type, link });
  }
  function getUsername() {
    return reply.username;
  }
  function getMessage() {
    return reply.message;
  }
  function getOwner() {
    return reply.owner;
  }
  function getEmail() {
    return reply.email;
  }
  function getType() {
    return reply.type;
  }
  function getLink() {
    return reply.link;
  }
  function close() {
    setReply(
      falseReply.username,
      falseReply.message,
      falseReply.owner,
      falseReply.email,
      falseReply.type,
      falseReply.link
    );
  }
  function isClosed() {
    return !reply.username &&
      !reply.message &&
      !reply.owner &&
      !reply.email &&
      !reply.type &&
      !reply.link
      ? true
      : false;
  }
  const values = {
    getUsername,
    getMessage,
    setReply,
    close,
    isClosed,
    getOwner,
    getEmail,
    getType,
    getLink,
  };

  return <context.Provider value={values}>{children}</context.Provider>;
}
export function useReply() {
  return useContext(context);
}

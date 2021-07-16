import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
  useLayoutEffect,
} from "react";
import firebase from "firebase";
import classes from "./chat.module.css";
import ScrollBtn from "./scrollBtn";
import MapMessage from "./mapMessageArray";
import { useScreen2 } from "../context/screen2Context";

function Chat({
  meetingRoom,
  myEmail,
  show,
  setShow,
  bodyRef,
  shouldScrollToBottom,
  setScrollToBottom,
  track,
  type,
}) {
  //paginate variables
  const numberOfMessagesPerPage = 20;
  const isEnded = useRef(false);
  const queryCursor = useRef(null);
  const currentBodyPosition = useRef(null);

  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const scr2Ctx = useScreen2();

  const updateDb = useCallback(
    (message, key) => {
      if (myEmail === message.createdBy) {
        if (message.readRecipient !== "read") {
          if (message.seenBy && message.seenBy.length === 1) {
            firebase
              .database()
              .ref(`contacts/${meetingRoom}/messages/${key}/readRecipient`)
              .set("read");
            message.readRecipient = "read";
          }
        }
      } else {
        if (!message.seenBy || message.seenBy.indexOf(myEmail) === -1) {
          let idx = 0;
          if (message.seenBy) {
            idx = message.seenBy.length;
          }
          firebase
            .database()
            .ref(`contacts/${meetingRoom}/messages/${key}/seenBy/${idx}`)
            .set(myEmail);
        }
      }
    },
    [meetingRoom, myEmail]
  );
  const cleared = useRef("");
  useEffect(() => {
    const ref = firebase.database().ref(`contacts/${meetingRoom}/messages`);

    ref.on("child_changed", (snapshot) => {
      if (cleared.current === "" || snapshot.key < cleared.current) {
        const data = snapshot.val();

        updateDb(data, snapshot.key);

        setMessages((prev) => {
          return { ...prev, [snapshot.key]: data };
        });
      }
    });
  }, [meetingRoom, updateDb, track]);
  useEffect(() => {
    let ref = firebase
      .database()
      .ref(`contacts/${meetingRoom}/messages/cleared`);
    ref.on("child_changed", (snapshot) => {
      console.log(snapshot.key, myEmail);
      if (snapshot.key === myEmail) {
        cleared.current = snapshot.val();
        queryCursor.current = null;
        scr2Ctx.setRender({
          meetingRoom: meetingRoom,
          type: "contact",
          snapshot,
        });
        setMessages({});
      }
    });
    return () => {
      console.log("child changed turned off");
      ref.off("child_changed");
    };
  }, [meetingRoom, myEmail]);

  const getMessages = useCallback(
    async (numberOfMessagesPerPage) => {
      if (meetingRoom) {
        let allMessagesRef = firebase
          .database()
          .ref(`contacts/${meetingRoom}/messages`)
          .orderByKey();

        if (queryCursor.current === null) {
          let ref = firebase
            .database()
            .ref(`contacts/${meetingRoom}/messages/cleared`);
          cleared.current = await ref
            .once("value", (snapshot) => {
              return snapshot;
            })
            .then((snapshot) => {
              if (snapshot.val()[myEmail] !== undefined) {
                return snapshot.val()[myEmail];
              }
            });
        }

        allMessagesRef =
          queryCursor.current === null
            ? allMessagesRef
            : allMessagesRef.startAfter(`${queryCursor.current}`);

        allMessagesRef
          .endBefore(`${cleared.current}`)
          .limitToFirst(numberOfMessagesPerPage)
          .once("value", (snapshot) => {
            const paginatedMessages = snapshot.val();

            let deleted = 0;
            for (let i in paginatedMessages) {
              if (i !== "cleared") {
                if (
                  !paginatedMessages[i].deletedBy ||
                  Object.values(paginatedMessages[i].deletedBy).indexOf(
                    myEmail
                  ) === -1
                ) {
                  updateDb(paginatedMessages[i], i);
                } else {
                  deleted++;
                }
              }
            }

            if (paginatedMessages) {
              delete paginatedMessages["cleared"];
              if (
                Object.keys(paginatedMessages).length < numberOfMessagesPerPage
              ) {
                isEnded.current = true;
                queryCursor.current = null;
              } else {
                queryCursor.current =
                  Object.keys(paginatedMessages)[numberOfMessagesPerPage - 1];
              }
              setMessages((prev) => {
                return { ...prev, ...paginatedMessages };
              });
            }
            if (deleted) {
              getMessages(deleted);
            }
          });
      }
    },
    [meetingRoom, queryCursor, myEmail, updateDb]
  );
  useEffect(() => {
    currentBodyPosition.current = bodyRef.current.scrollHeight;
    getMessages(numberOfMessagesPerPage);

    setLoading(false);
  }, [meetingRoom, bodyRef, getMessages]);

  useEffect(() => {
    if (isEnded.current === false && show === true) {
      setLoading(true);
      currentBodyPosition.current = bodyRef.current.scrollHeight;
      getMessages(numberOfMessagesPerPage);

      setShow(false);
      setLoading(false);
    }
  }, [show, setShow, getMessages, bodyRef]);
  useLayoutEffect(() => {
    if (bodyRef.current) {
      if (
        currentBodyPosition.current !== 0 &&
        bodyRef.current.scrollHeight > currentBodyPosition.current
      ) {
        bodyRef.current.scrollTop =
          bodyRef.current.scrollHeight - currentBodyPosition.current;
        currentBodyPosition.current = 0;
      }
    }
  });
  const MessagesArr = Object.keys(messages).sort((a, b) => b - a);

  useLayoutEffect(() => {
    if (shouldScrollToBottom && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  });

  return (
    <Fragment>
      {loading === true ? (
        <div className={classes.loadingBkg}>
          <div></div>
        </div>
      ) : null}
      <ScrollBtn
        shouldScrollToBottom={shouldScrollToBottom}
        setScrollToBottom={setScrollToBottom}
        bodyRef={bodyRef}
      />
      <MapMessage
        meetingRoom={meetingRoom}
        MessagesArr={MessagesArr}
        messages={messages}
        myEmail={myEmail}
      />
    </Fragment>
  );
}
export default Chat;

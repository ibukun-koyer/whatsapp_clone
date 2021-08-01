import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Fragment,
  useLayoutEffect,
} from "react";
import firebase from "firebase/app";
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
  length,
  users,
}) {
  //paginate variables
  const numberOfMessagesPerPage = 20;
  const isEnded = useRef(false);
  const queryCursor = useRef(null);
  const currentBodyPosition = useRef(null);

  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const scr2Ctx = useScreen2();

  // update the database based on if im just reading the message or if all users have read my message
  const updateDb = useCallback(
    (message, key) => {
      if (myEmail === message.createdBy) {
        if (message.readRecipient !== "read") {
          if (message.seenBy && message.seenBy.length === length) {
            firebase
              .database()
              .ref(`${type}s/${meetingRoom}/messages/${key}/readRecipient`)
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
            .ref(`${type}s/${meetingRoom}/messages/${key}/seenBy/${idx}`)
            .set(myEmail);
        }
      }
    },
    [meetingRoom, myEmail, type, length]
  );
  const cleared = useRef("");
  // updates chats based on new message entered, THIS IS AFFECTED BY messageUpdate, closing this results to the other being closed and turns off listening on changes
  useEffect(() => {
    const ref = firebase.database().ref(`${type}s/${meetingRoom}/messages`);

    ref.on("child_changed", (snapshot) => {
      if (!cleared.current || snapshot.key < cleared.current) {
        const data = snapshot.val();

        updateDb(data, snapshot.key);

        setMessages((prev) => {
          return { ...prev, [snapshot.key]: data };
        });
      }
    });
    // return () => {
    //   ref.off("child_changed");
    // };
  }, [meetingRoom, updateDb, track, type]);

  //whenever we clear chats, clear message and alert messageUpdates of the changes
  useEffect(() => {
    let ref = firebase
      .database()
      .ref(`${type}s/${meetingRoom}/messages/cleared`);
    ref.on("child_changed", (snapshot) => {
      if (snapshot.key === myEmail) {
        cleared.current = snapshot.val();
        queryCursor.current = null;
        scr2Ctx.setRender({
          meetingRoom: meetingRoom,
          type,
          snapshot,
        });
        setMessages({});
      }
    });
    return () => {
      ref.off("child_changed");
    };
  }, [meetingRoom, myEmail, scr2Ctx, type]);

  // update the message based and paginate results
  const getMessages = useCallback(
    async (numberOfMessagesPerPage) => {
      if (meetingRoom) {
        let allMessagesRef = firebase
          .database()
          .ref(`${type}s/${meetingRoom}/messages`)
          .orderByKey();

        if (queryCursor.current === null) {
          let ref = firebase
            .database()
            .ref(`${type}s/${meetingRoom}/messages/cleared`);
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
    [meetingRoom, queryCursor, myEmail, updateDb, type]
  );
  // if we are still fetching, loading is set to true
  useEffect(() => {
    currentBodyPosition.current = bodyRef.current.scrollHeight;
    getMessages(numberOfMessagesPerPage);

    setLoading(false);
  }, [meetingRoom, bodyRef, getMessages]);

  // allow message fetching until message fetching isnt possible again, i.e no more old messages
  useEffect(() => {
    if (isEnded.current === false && show === true) {
      setLoading(true);
      currentBodyPosition.current = bodyRef.current.scrollHeight;
      getMessages(numberOfMessagesPerPage);

      setShow(false);
      setLoading(false);
    }
  }, [show, setShow, getMessages, bodyRef]);
  // scrolling function, used alongside the bodyref from ChatPage, and allows us to change body scrolltop
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
        type={type}
        users={users}
      />
    </Fragment>
  );
}
export default Chat;

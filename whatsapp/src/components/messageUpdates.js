import classes from "./messageUpdates.module.css";
import firebase from "firebase/app";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { useAuth } from "../context/authContext";
import { useEffect, useRef, useState } from "react";
import { multiIndex } from "./helperFiles/multiIndexStructure";
import MapUpdates from "./mapUpdates";
import { useScreen2 } from "../context/screen2Context";
function MessageUpdates() {
  const authentication = useAuth();
  const [contacts, setContacts] = useState(0);
  const ctx = useScreen2();
  const storeDS = useRef(new multiIndex());
  async function fetcher(queryString, callback, addons = []) {
    let ref = firebase.database().ref(queryString);
    for (let i of addons) {
      ref = ref[i[0]](i[1]);
    }

    ref.once("value", (snapshot) => {
      callback(snapshot);
    });
  }

  const clearValue = useRef(0);
  useEffect(() => {
    if (ctx.rerender?.type) {
      const thisMessage = storeDS.current.getByRoom(ctx.rerender.meetingRoom);

      storeDS.current.updateMessage(
        ctx.rerender.meetingRoom,
        "",
        ctx.rerender.type === "group" ? "cleared" : 0
      );
      clearValue.current = ctx.rerender.snapshot.val();
      ctx.setRender({});

      setContacts((prev) => !prev);
    }
  }, [ctx.rerender]);
  useEffect(() => {
    if (authentication.currentUser) {
      let ref = [];
      const myEmail = replaceInvalid(authentication.currentUser.email);

      //fetch ur contacts
      fetcher(`users/${myEmail}/contacts`, (snapshot) => {
        for (let i in snapshot.val()) {
          //listen on the message, check to see if the contact had been in the array before, if not add it to the array not update
          //listen on the message, check to see if the contact had been in the array before, if not add it to the array not update

          let temp = firebase
            .database()
            .ref(`contacts/${snapshot.val()[i]}/messages`);
          temp.on("child_changed", (message) => {
            if (
              parseInt(
                storeDS.current.getByRoom(snapshot.val()[i]).createdAt
              ) >= parseInt(message.key) &&
              (!clearValue.current || clearValue.current > message.key)
            ) {
              storeDS.current.updateMessage(
                snapshot.val()[i],
                message.val(),
                message.key
              );
            }

            setContacts((prev) => prev + 1);
          });
          ref.push([temp, snapshot.val()[i]]);
          //given each contact, fetch their last message
          fetcher(
            `contacts/${snapshot.val()[i]}/messages`,
            async (message) => {
              //get cleared

              let cleared = firebase
                .database()
                .ref(`contacts/${snapshot.val()[i]}/messages/cleared`);
              let escape = await cleared
                .once("value", (snapshot) => {
                  return snapshot;
                })
                .then((snapshot) => {
                  if (snapshot.val()[myEmail] !== undefined) {
                    return snapshot.val()[myEmail];
                  }
                });

              let isMessageCleared = false;
              if (
                escape === undefined ||
                escape > parseInt(Object.keys(message.val())[0])
              ) {
              } else {
                isMessageCleared = true;
              }

              //given each message, proceed to get the users info and create an multiindex obj
              fetcher(`users/${i}`, (info) => {
                storeDS.current.add({
                  username: info.val().username,
                  online: info.val().online,
                  url: info.val().url,
                  uid: info.val().uid,
                  status: info.val().status,
                  message: message.val(),
                  type: "contact",
                  email: i,
                  createdAt:
                    Object.keys(message.val())[0] === "cleared" ||
                    isMessageCleared
                      ? 0
                      : parseInt(Object.keys(message.val())[0]),
                  meetingRoom: snapshot.val()[i],
                });
                setContacts((prev) => prev + 1);
              });
            },
            [["limitToFirst", 1]]
          );
        }
      });

      //fetch ur groups
      fetcher(`users/${myEmail}/groups`, (snapshot) => {
        for (let i in snapshot.val()) {
          let temp = firebase
            .database()
            .ref(`groups/${snapshot.val()[i]}/messages`);
          temp.on("child_changed", (message) => {
            console.log(
              parseInt(
                storeDS.current.getByRoom(snapshot.val()[i]).createdAt
              ) >= parseInt(message.key) &&
                (!clearValue.current || clearValue.current > message.key)
            );
            if (
              parseInt(
                storeDS.current.getByRoom(snapshot.val()[i]).createdAt
              ) >= parseInt(message.key) &&
              (!clearValue.current || clearValue.current > message.key)
            ) {
              storeDS.current.updateMessage(
                snapshot.val()[i],
                message.val(),
                message.key
              );
            }

            setContacts((prev) => prev + 1);
          });
          ref.push([temp, snapshot.val()[i]]);
          //given each group, fetch ur last message
          fetcher(
            `groups/${snapshot.val()[i]}/messages`,
            async (message) => {
              let cleared = firebase
                .database()
                .ref(`groups/${snapshot.val()[i]}/messages/cleared`);
              let escape = await cleared
                .once("value", (snapshot) => {
                  return snapshot;
                })
                .then((snapshot) => {
                  if (snapshot.val()[myEmail] !== undefined) {
                    return snapshot.val()[myEmail];
                  }
                });

              let isMessageCleared = false;
              if (
                escape === undefined ||
                escape > parseInt(Object.keys(message.val())[0])
              ) {
              } else {
                isMessageCleared = true;
              }
              //given each message, fetch the group info and also add that to the multiindexed obj
              fetcher(`groups/${snapshot.val()[i]}`, (info) => {
                storeDS.current.add({
                  message: isMessageCleared ? { cleared: "" } : message.val(),
                  createdBy: info.val().createdBy,
                  url: info.val().imageUrl,
                  groupTitle: info.val().groupTitle,
                  groupUsers: info.val().users,
                  createdAt:
                    Object.keys(message.val())[0] === "cleared" ||
                    isMessageCleared
                      ? info.val().createdAt
                      : parseInt(Object.keys(message.val())[0]),
                  type: "group",
                  meetingRoom: snapshot.val()[i],
                });
                setContacts((prev) => prev + 1);
              });
            },
            [["limitToFirst", 1]]
          );
        }
      });
      return () => {
        for (let i of ref) {
          i[0].off("child_changed");
        }
      };
    }
  }, [authentication.currentUser, setContacts]);

  storeDS.current.display();
  return (
    <div className={classes.messagesContainer}>
      {contacts === 0 ? (
        <div
          className={classes.messagesContainer}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          You have no messages
        </div>
      ) : (
        <MapUpdates storeDS={storeDS} />
      )}
    </div>
  );
}
export default MessageUpdates;

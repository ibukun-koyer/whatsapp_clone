import classes from "./messageUpdates.module.css";
import firebase from "firebase/app";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { useAuth } from "../context/authContext";
import { useEffect, useRef, useState } from "react";
import { multiIndex } from "./helperFiles/multiIndexStructure";
import MapUpdates from "./mapUpdates";

function MessageUpdates() {
  const authentication = useAuth();
  const [contacts, setContacts] = useState(0);
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

  useEffect(() => {
    if (authentication.currentUser) {
      const myEmail = replaceInvalid(authentication.currentUser.email);

      //fetch ur contacts
      fetcher(`users/${myEmail}/contacts`, (snapshot) => {
        for (let i in snapshot.val()) {
          //given each contact, fetch their last message
          fetcher(
            `contacts/${snapshot.val()[i]}/messages`,
            (message) => {
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
                    Object.keys(message.val())[0] === "cleared"
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
          //given each group, fetch ur last message
          fetcher(
            `groups/${snapshot.val()[i]}/messages`,
            (message) => {
              //given each message, fetch the group info and also add that to the multiindexed obj
              fetcher(`groups/${snapshot.val()[i]}`, (info) => {
                storeDS.current.add({
                  message: message.val(),
                  createdBy: info.val().createdBy,
                  url: info.val().imageUrl,
                  groupTitle: info.val().groupTitle,
                  groupUsers: info.val().users,
                  createdAt:
                    Object.keys(message.val())[0] === "cleared"
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
    }
  }, [authentication.currentUser, setContacts]);

  console.log(storeDS.current);

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
        <MapUpdates
          contacts={contacts}
          setContacts={setContacts}
          storeDS={storeDS}
        />
      )}
    </div>
  );
}
export default MessageUpdates;

import classes from "./messageUpdates.module.css";
import firebase from "firebase/app";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { useAuth } from "../context/authContext";
import { useCallback, useEffect, useRef } from "react";

import MapUpdates from "./mapUpdates";
import { useScreen2 } from "../context/screen2Context";
function MessageUpdates({ storeDS, contacts, setContacts }) {
  // define context
  const authentication = useAuth();

  const ctx = useScreen2();

  // creates a means to query database, a way to cut down writing more code, if u will
  async function fetcher(queryString, callback, addons = []) {
    let ref = firebase.database().ref(queryString);
    //add filters, for example, limit to first, endAt, so on...
    for (let i of addons) {
      ref = ref[i[0]](i[1]);
    }
    // create a socket
    ref.once("value", (snapshot) => {
      callback(snapshot);
    });
  }

  // stores the clear value
  const clearValue = useRef(0);

  // a function used by both group and contact to help get all initial messages that show up allmessages and then also creates listeners
  // that check to see if there is a change to any of the contacts, also returns turned on sockets so they ca be turned off
  const getInitialMessages = useCallback(
    (type, i, snapshot, myEmail, infoQueryStr, add) => {
      // create a ref to the messages
      let temp = firebase
        .database()
        .ref(`${type}s/${snapshot.val()[i]}/messages`);
      // on child changes to the contact or group, update the message
      temp.on("child_changed", (message) => {
        // checks to see if the changed message is a current or future message, old message changes are disregarded

        if (
          parseInt(storeDS.current.getByRoom(snapshot.val()[i]).createdAt) >=
            parseInt(message.key) &&
          (!clearValue.current || clearValue.current > message.key)
        ) {
          // stored using refrences, hence we have a state below to prompt rerender
          storeDS.current.updateMessage(
            snapshot.val()[i],
            message.val(),
            message.key
          );
        }

        setContacts((prev) => prev + 1);
      });

      //given each contact/group, fetch their last message
      fetcher(
        `${type}s/${snapshot.val()[i]}/messages`,
        async (message) => {
          // this minute section checks to see if this user cleared his messages and at what point did he clear his messages

          let cleared = firebase
            .database()
            .ref(`${type}s/${snapshot.val()[i]}/messages/cleared`);
          let escape = await cleared
            .once("value", (snapshot) => {
              return snapshot;
            })
            .then((snapshot) => {
              if (snapshot) {
                if (snapshot.val()[myEmail] !== undefined) {
                  return snapshot.val()[myEmail];
                }
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
          //end of answering messagecleared question

          //given each message, proceed to get the users info and create an multiindex obj
          fetcher(infoQueryStr, (info) => {
            add(info, message, isMessageCleared);
            setContacts((prev) => prev + 1);
          });
        },
        //this section limits to the first message
        [["limitToFirst", 1]]
      );
      return [temp, snapshot.val()[i]];
    }
  );
  useEffect(() => {
    // if screen 2 context method, rerender is setContacts, then this means we clear the messages, the rerender is set in chat.js
    if (ctx.rerender?.type) {
      // get the data at the meeting room
      // const thisMessage = storeDS.current.getByRoom(ctx.rerender.meetingRoom);

      // update multiindex Array, note, 0 for contacts means that the index will be ignored by mapUpdates, but for group, we set to
      //cleared and the multiindex sets the time to its previous time, this ensures that we can still sort.
      storeDS.current.updateMessage(
        ctx.rerender.meetingRoom,
        "",
        ctx.rerender.type === "group" ? "cleared" : 0
      );
      //set the clear value to the time
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
          //for all our contacts, fetch them and add the last message to the multiindex array
          let cleanupData = getInitialMessages(
            "contact",
            i,
            snapshot,
            myEmail,
            `users/${i}`,
            // this below function ensures that we add values specific to contact to the multiindex array
            (info, message, isMessageCleared) => {
              storeDS.current.add({
                username: info.val().username,
                online: info.val().online.current,
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
            }
          );
          ref.push(cleanupData);
        }
      });

      //fetch ur groups
      fetcher(`users/${myEmail}/groups`, (snapshot) => {
        for (let i in snapshot.val()) {
          //for all our groups, fetch them and add the last message to the multiindex array
          let cleanupData = getInitialMessages(
            "group",
            i,
            snapshot,
            myEmail,
            `groups/${snapshot.val()[i]}`,
            // this below function ensures that we add values specific to contact to the multiindex array
            (info, message, isMessageCleared) => {
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
            }
          );
          ref.push(cleanupData);
        }
      });
      // remeber that we have all the turned on references, now we loop through and turn them off
      //THIS AREA CONFLICTS WITH A SOCKET IN CHAT, WHEN THAT TURNS OFF FOR CLEANUP, THIS IS ALSO CLOSED, THE ONLY DIFFERENCE IS THAT
      //THIS NEVER TURNS BACK ON, TO FIX THIS WE MIGHT NEED A STATE TO TELL THIS TO RERENDER WHEN THAT CLEANS UP
      return () => {
        for (let i of ref) {
          i[0].off("child_changed");
        }
      };
    }
  }, [authentication.currentUser, setContacts]);

  return (
    <div className={classes.messagesContainer}>
      {/* if we have no contacts */}
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

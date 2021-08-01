import page from "./page.module.css";
import ownClass from "./showContacts.module.css";
import { useScreen1 } from "../context/screen1Context";

import SearchBar from "./searchBar";
import { pageNames } from "./helperFiles/globals";

import { useState, useEffect } from "react";
import { useFull } from "../context/requestFullScreen";
import firebase from "firebase";
import { useAuth } from "../context/authContext";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";

import PageHeader from "./pageHeader";
import CreateAllContact from "./createAllContact";
function ShowContacts() {
  const context = useScreen1();
  const fullScreen = useFull();
  const authentication = useAuth();

  const [contacts, allContacts] = useState([]);
  useEffect(() => {
    const ref = firebase
      .database()
      .ref(
        `/users/${replaceInvalid(authentication.currentUser.email)}/contacts`
      );
    const myContacts = [];
    async function get(i) {
      await firebase
        .database()
        .ref(`/users/${replaceInvalid(i)}`)
        .once("value", (snapshot) => {
          const { username, url, status, online } = snapshot.val();

          myContacts.push({
            email: replaceInvalid(i),
            username,
            url,
            status,
            online: online.current,
            hide: false,
          });
          // allContacts(myContacts);
        });
    }
    ref.once("value", async (snapshot) => {
      if (snapshot.val()) {
        for (let i in snapshot.val()) {
          await get(i);
        }


        allContacts(
          myContacts.sort(function (a, b) {
            var nameA = a.username.toUpperCase(); // ignore upper and lowercase
            var nameB = b.username.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          })
        );
      }
    });
  }, [fullScreen.showFull, authentication.currentUser.email]);

  function handleContactClick() {
    fullScreen.provideFullScreen(1);
  }
  function handleGroupClick() {
    context.setPage({ prev: pageNames.showContacts, curr: pageNames.addGroup });
  }
  function searchOngoing(searchStr) {
    allContacts((prev) => {
      const newArray = [...prev];
      return newArray.map((i) => {
 
        if (i.username.toLowerCase().indexOf(searchStr.toLowerCase()) === -1) {
          i.hide = true;
          return i;
        } else {
          i.hide = false;
          return i;
        }
      });
    });
  }
  return (
    <div
      className={
        (context.state.curr === pageNames.showContacts
          ? page.animate1
          : page.animate2) +
        " " +
        page.onTop +
        " " +
        page.abs +
        " " +
        page.initializePage
      }
    >
      <PageHeader
        header="New chat"
        onClick={() => {
          context.setPage({
            curr: pageNames.allMessages,
            prev: pageNames.showContacts,
          });
        }}
      />
      <SearchBar
        def={true}
        placeholder="Search contacts"
        editFxn={searchOngoing}
      />

      <div
        style={{
          width: "100%",
          overflow: "auto",
          height: "calc(100% - (110px + 56px))",
        }}
        className={ownClass.space}
      >
        <div className={ownClass.new} onClick={handleContactClick}>
          <div className={ownClass.icon}>
            <img
              src={process.env.PUBLIC_URL + "/contactIcon.png"}
              alt="contaticon"
            />
          </div>
          <span>New Contact</span>
        </div>
        <div className={ownClass.new} onClick={handleGroupClick}>
          <div className={ownClass.icon}>
            <img
              src={process.env.PUBLIC_URL + "/groupIcon.png"}
              alt="groupd icon"
            />
          </div>
          <span>New Group</span>
        </div>

        <CreateAllContact
          contacts={contacts}
          onClick={() =>
            context.setPage({
              prev: pageNames.showContacts,
              curr: pageNames.allMessages,
            })
          }
          fxnId={2}
        />
      </div>
    </div>
  );
}
export default ShowContacts;

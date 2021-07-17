import page from "./page.module.css";
import { useScreen1 } from "../context/screen1Context";

import PageHeader from "./pageHeader";
import { pageNames } from "./helperFiles/globals";
import ownClass from "./addGroup.module.css";
import { useEffect, useState, useRef } from "react";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { useAuth } from "../context/authContext";
import CreateAllContact from "./createAllContact";
import firebase from "firebase";
import scroll from "./showContacts.module.css";

const initialHeight = 80;
const updatedHeight = 120;

const userIconHeight = 1.5;
const paddingBottom = 0.5;
const maxHeight = 10;
const topMargin = 2.5;
function AddGroup() {
  const ref = useRef();
  const authentication = useAuth();
  const context = useScreen1();
  const [changed, setChanged] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedIcons, setSelectedIcons] = useState([]);

  //get contacts, to be used to add to group
  useEffect(() => {
    // fetch contacts
    const ref = firebase
      .database()
      .ref(
        `/users/${replaceInvalid(authentication.currentUser.email)}/contacts`
      );
    const myContacts = [];
    // this function gets all contacts
    async function get(i) {
      await firebase
        .database()
        .ref(`/users/${replaceInvalid(i)}`)
        .once("value", (snapshot) => {
          const { username, url, status } = snapshot.val();
          myContacts.push({
            email: replaceInvalid(i),
            username,
            url,
            status,
          });
        });
    }
    ref.once("value", async (snapshot) => {
      if (snapshot.val()) {
        for (let i in snapshot.val()) {
          await get(i);
        }
        // store the contacts into the contacts state, in alphabetical order, and remove me
        setContacts(
          myContacts
            .sort(function (a, b) {
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
            .filter((curr) => {
              if (
                curr.username.toLowerCase().indexOf(changed.toLowerCase()) !==
                -1
              ) {
                return true;
              }
              return false;
            })
        );
      }
    });
  }, [changed, authentication.currentUser.email]);
  const calcHeightOfUsers =
    (userIconHeight + paddingBottom) * selectedIcons.length > maxHeight
      ? maxHeight
      : (userIconHeight + paddingBottom) * selectedIcons.length;
  return (
    <div
      // the actual page classes, animation, initialization all included here
      className={
        (context.state.curr === pageNames.groupInfo &&
        context.state.prev === pageNames.addGroup
          ? page.animate2
          : context.state.prev === pageNames.groupInfo &&
            context.state.curr === pageNames.addGroup
          ? page.animate1
          : context.state.curr === pageNames.addGroup
          ? page.animate3
          : page.animate4) +
        " " +
        page.onTop +
        " " +
        page.abs +
        " " +
        page.initializePage
      }
    >
      {/* create page header */}
      <PageHeader
        header="Add group participants"
        onClick={() => {
          context.setPage({
            prev: pageNames.addGroup,
            curr: pageNames.showContacts,
          });
        }}
      />
      {/* create the contact section */}
      {selectedIcons.length !== 0 ? (
        <div
          style={{
            height: `${calcHeightOfUsers}rem`,
            overflow: "auto",
            borderBottom: "none",
          }}
          className={scroll.space + " " + ownClass.input}
        >
          {selectedIcons.map((icons) => {
            return (
              <div
                className={ownClass.userPicked}
                style={{ marginBottom: `${paddingBottom}rem` }}
                key={icons.email}
              >
                <img
                  src={icons.url}
                  alt="users icon"
                  style={{
                    width: `${userIconHeight}rem`,
                    height: `${userIconHeight}rem`,
                    borderRadius: "50%",
                  }}
                />
                <div className={ownClass.txt}>{icons.username}</div>
                <i
                  className={`fa fa-times ${ownClass.txt} ${ownClass.times}`}
                  aria-hidden="true"
                  onClick={() => {
                    setSelectedIcons((prev) =>
                      prev.filter((curr) => {
                        if (curr.email === icons.email) {
                          return false;
                        }
                        return true;
                      })
                    );
                  }}
                ></i>
              </div>
            );
          })}
        </div>
      ) : null}
      <input
        type="text"
        placeholder="Type contact name"
        className={ownClass.input}
        ref={ref}
        onChange={(e) => setChanged(ref.current.value)}
      />

      <div
        style={{
          width: "100%",
          overflow: "auto",
          height: `calc(100% - (110px + 56px + ${
            selectedIcons.length === 0 ? initialHeight : updatedHeight
          }px + ${calcHeightOfUsers}rem + ${
            selectedIcons.length !== 0 ? topMargin : 0
          }rem)`,
        }}
        className={scroll.space}
      >
        <CreateAllContact
          contacts={contacts}
          onClick={setSelectedIcons}
          fxnId={1}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: `${
            selectedIcons.length === 0 ? initialHeight : updatedHeight
          }px`,
          backgroundColor: "var(--lightGray)",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        {selectedIcons.length !== 0 ? (
          <button
            className={ownClass.nextBtn}
            onClick={() =>
              context.setPage({
                prev: pageNames.addGroup,
                curr: pageNames.groupInfo,
                transferData: selectedIcons.map((curr) => {
                  return [curr.email, curr.username];
                }),
              })
            }
          >
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
}
export default AddGroup;

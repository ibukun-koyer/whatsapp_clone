import classes from "./allMessages.module.css";
import { Fragment, useState, useRef, useEffect } from "react";
import SearchBar from "./searchBar";
import { useScreen1 } from "../context/screen1Context";
import { pageNames } from "./helperFiles/globals";
import MessageUpdates from "./messageUpdates";
import shouldShowDropDown from "./helperFiles/shouldDropDown";
import { useOption } from "../context/showOptions";
import { useAuth } from "../context/authContext";

function AllMessages() {
  const context = useScreen1();
  const optionCtx = useOption();
  const [clicked, setClicked] = useState(false);
  const refToDiv = useRef();
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const authentication = useAuth();

  const optionArr = ["New group", "Profile", "Settings", "Log out"];
  useEffect(() => {
    //we set the output of the option context when we click on one
    if (optionCtx.getOutput) {
      //if the output/clicked is delete, then we want to delete a message
      if (optionCtx.getOutput === optionArr[0]) {
        context.setPage({
          prev: pageNames.allMessages,
          curr: pageNames.addGroup,
        });
      }
      //if we are replying a message
      if (optionCtx.getOutput === optionArr[1]) {
        context.setPage({
          prev: pageNames.allMessages,
          curr: pageNames.myProfile,
        });
      }
      //if we are clearing out message
      if (optionCtx.getOutput === optionArr[2]) {
        context.setPage({
          prev: pageNames.allMessages,
          curr: pageNames.settings,
        });
      }
      if (optionCtx.getOutput === optionArr[3]) {
        authentication.logout();
      }
      // clean out the output field after acting upon the selected action
      optionCtx.setOutput("");
    }
  }, [optionCtx.getOutput, optionCtx]);

  useEffect(() => {
    if (context.myInfo) {
      setImageIsLoading(false);
    }
  }, [context.myInfo]);

  // this is what happens when you click on the show contacts, allows me to animate show contacts in and this page out
  function showContacts() {
    context.setPage({
      prev: pageNames.allMessages,
      curr: pageNames.showContacts,
    });
  }
  function showProfile() {
    context.setPage({
      prev: pageNames.allMessages,
      curr: pageNames.myProfile,
    });
  }
  return (
    <div className={classes.bkgDefault}>
      {/* render top section */}
      <div className={classes.top + " " + classes.darkGray}>
        {/* render my profile picture */}
        <div className={classes.pp} onClick={showProfile}>
          {/* the image that will be inside the profile picture circle */}
          <div className={classes.img}>
            {imageIsLoading ? null : (
              <img
                src={context.myInfo.url}
                alt="contacts icons"
                className={classes.pp}
              />
            )}
          </div>
        </div>
        {/* this contains the three options, showContacts, settings, status */}
        <div className={classes.nav}>
          {/* all svg icons */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            onClick={showContacts}
          >
            <path
              fill="currentColor"
              d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
            ></path>
          </svg>
          <div
            style={{ position: "relative" }}
            onClick={(e) => {
              shouldShowDropDown(
                refToDiv.current,
                optionCtx,
                undefined,
                optionArr,
                100,
                setClicked,
                () => clicked === true && optionCtx.getShow
              );
            }}
            ref={refToDiv}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="currentColor"
                d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      {/* this is the searchbar */}
      <SearchBar
        def={false}
        placeholder="Search or start new chat"
        shadow={true}
      />
      {/* this is the part that renders the messages in all messages */}
      <MessageUpdates />
    </div>
  );
}
export default AllMessages;

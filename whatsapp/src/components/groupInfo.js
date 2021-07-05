import { useScreen1 } from "../context/screen1Context";
import page from "./page.module.css";
import { pageNames } from "./helperFiles/globals";
import PageHeader from "./pageHeader";
import classes from "./groupInfo.module.css";
import { useRef, useState, useEffect, Fragment } from "react";
import btn from "./addGroup.module.css";
import { onImageChange, onImageSubmit } from "./helperFiles/imageHandler";
import Alert from "./alert";
import firebase from "firebase";
import { useAuth } from "../context/authContext";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import SearchBarOption2 from "./SearchBarOption2";
import { defaultUrl } from "./helperFiles/globals";
function GroupInfo() {
  const authentication = useAuth();
  const [imageUrl, setImageUrl] = useState(defaultUrl);
  const [imageError, setImageError] = useState("");
  const [shouldSubmit, submit] = useState(false);
  const [serverError, setServerError] = useState({
    fbType: "",
    fbHeader: "",
    fbDes: "",
  });
  const context = useScreen1();
  const titleRef = useRef();
  const [valueChanged, setChanged] = useState(0);
  // console.log(context.state.transferData);
  const title = titleRef.current ? titleRef.current.value : "";
  useEffect(() => {
    function createGroup(url) {
      const users = [
        ...context.state.transferData,
        replaceInvalid(authentication.currentUser.email),
      ];
      const groupInitialize = {
        groupTitle: title,
        imageUrl: url,
        users: users,
        createdBy: replaceInvalid(authentication.currentUser.email),
        deletedBy: "",
        messages: { cleared: "" },
        createdAt: firebase.firestore.Timestamp.now().seconds * -1,
      };
      const groupRef = firebase
        .database()
        .ref("/groups")
        .push(groupInitialize).key;
      for (let i of users) {
        firebase.database().ref(`/users/${i}/groups`).push(groupRef);
      }
      context.setPage({
        prev: pageNames.groupInfo,
        curr: pageNames.allMessages,
      });
    }

    function onError(e) {
      setServerError({
        fbType: "red",
        fbHeader: "Oops, an error occured",
        fbDes: e,
      });
    }
    if (shouldSubmit === true && context.state.transferData) {
      onImageSubmit(defaultUrl, imageUrl, createGroup, onError, "image");
    }
  }, [
    shouldSubmit,
    authentication.currentUser.email,
    context,
    imageUrl,
    title,
  ]);
  function handleImageChange(e) {
    const fileObj = e.target.files[0];
    onImageChange(fileObj, setImageError, setImageUrl);
  }

  return (
    <div
      className={
        (context.state.curr === pageNames.groupInfo
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
      {serverError.fbType === "" ? null : (
        <Alert
          color={serverError.fbType}
          header={serverError.fbHeader}
          msg={serverError.fbDes}
          onClick={() =>
            setServerError({
              fbType: "",
              fbHeader: "",
              fbDes: "",
            })
          }
          closeTxt="close"
        />
      )}
      {shouldSubmit === false ? (
        <Fragment>
          <PageHeader
            header="New group"
            onClick={() => {
              context.setPage({
                prev: pageNames.groupInfo,
                curr: pageNames.addGroup,
              });
            }}
          />
          <div className={classes.body}>
            <div className={classes.flex + " " + classes.pad}>
              <div className={classes.wrapImage}>
                <div className={classes.userImage}>
                  <img
                    src={imageUrl}
                    alt="groupIcon"
                    className={
                      classes.image +
                      " " +
                      (defaultUrl === imageUrl ? classes.initializeDefault : "")
                    }
                  />
                </div>

                <input
                  className={classes.imagePicker}
                  id="upload"
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={handleImageChange}
                />
                <div className={classes.des}>
                  <i
                    className={`fa fa-camera ${classes.camIcon}`}
                    aria-hidden="true"
                  ></i>
                  <div
                    style={{
                      width: "6rem",
                      textAlign: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    ADD GROUP ICON
                  </div>
                </div>
              </div>
              {imageError === "" ? null : (
                <div className={classes.center}>
                  <div className={classes.err}>*{imageError}</div>
                </div>
              )}
              <SearchBarOption2
                objRef={titleRef}
                valueChanged={valueChanged}
                // handleChange={handleChange}
                setChanged={setChanged}
                placeholder={"Group subject"}
                showCharacterCount
              />
            </div>
            {valueChanged > 0 ? (
              <div className={classes.next}>
                <button
                  className={btn.nextBtn + " " + classes.animate}
                  onClick={() => {
                    console.log(shouldSubmit);
                    submit(true);
                  }}
                >
                  <i className="fa fa-check" aria-hidden="true"></i>
                </button>
              </div>
            ) : null}
            {titleRef.current &&
              (titleRef.current.value.length === 0 ? (
                <div className={classes.next}>
                  <button className={btn.nextBtn + " " + classes.animateOut}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                  </button>
                </div>
              ) : null)}
          </div>
        </Fragment>
      ) : (
        <div
          className={page.initializePage}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "var(--lightGray)",
          }}
        >
          <div className={classes.loadBar}></div>
          <div className={classes.loadText}>Creating your group</div>
        </div>
      )}
    </div>
  );
}
export default GroupInfo;
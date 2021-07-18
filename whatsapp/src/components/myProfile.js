import { useScreen1 } from "../context/screen1Context";
import page from "./page.module.css";
import { defaultUrl, pageNames } from "./helperFiles/globals";
import { useRef, useState } from "react";
import PageHeader from "./pageHeader";
import DisplayImage from "./displayImage";
import { onImageChange, onImageSubmit } from "./helperFiles/imageHandler";
import classes from "./groupInfo.module.css";
import myClasses from "./myProfile.module.css";
import ProfileTypeInput from "./profileTypeInput";
import Alert from "./alert";
import firebase from "firebase";
import { useAuth } from "../context/authContext";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";

function MyProfile() {
  const authentication = useAuth();
  const context = useScreen1();
  const [serverError, setServerError] = useState({
    fbType: "",
    fbHeader: "",
    fbDes: "",
  });
  const nameRef = useRef(context.myInfo ? context.myInfo.username : "");
  const aboutRef = useRef(context.myInfo ? context.myInfo.status : "");
  const [imageError, setImageError] = useState("");

  const [imageUrl, setImageUrl] = useState(
    context.myInfo ? context.myInfo.url : defaultUrl
  );
  function handleImageChange(e) {
    const fileObj = e.target.files[0];
    onImageChange(fileObj, setImageError, setImageUrl);
  }

  const prevPage = useRef(context.state.prev);

  function submitAndReturn() {
    function updateInfo(url) {
      let shouldChangeName = !(
        (context.myInfo ? context.myInfo.username : "") === nameRef.current
      );
      let shouldChangeurl = !(
        (context.myInfo ? context.myInfo.url : defaultUrl) === url
      );
      let shouldChangeStatus = !(
        (context.myInfo ? context.myInfo.status : "") === aboutRef.current
      );

      if (shouldChangeName || shouldChangeStatus || shouldChangeurl) {
        let ref = firebase
          .database()
          .ref(`users/${replaceInvalid(authentication.currentUser.email)}`);

        if (shouldChangeName) ref.child(`username`).set(nameRef.current);
        if (shouldChangeurl) ref.child(`url`).set(url);
        if (shouldChangeStatus) ref.child(`status`).set(aboutRef.current);
      }
      context.setMyInfo({
        url,
        username: nameRef.current,
        status: aboutRef.current,
      });
      context.setPage({
        prev: pageNames.myProfile,
        curr: prevPage.current,
      });
    }

    function onError(e) {
      setServerError({
        fbType: "red",
        fbHeader: "Oops, an error occured",
        fbDes: e,
      });
    }

    onImageSubmit(
      context.myInfo ? context.myInfo.url : defaultUrl,
      imageUrl,
      updateInfo,
      onError,
      "image"
    );
  }
  return (
    <div
      className={
        (context.state.curr === pageNames.myProfile
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
      <PageHeader header="Profile" onClick={submitAndReturn} />
      <div className={myClasses.body}>
        <DisplayImage
          imageUrl={imageUrl}
          handleImageChange={handleImageChange}
          textAppearsOnHover
          text="CHANGE PROFILE PICTURE"
        />
        {imageError === "" ? null : (
          <div className={classes.center}>
            <div className={classes.err}>*{imageError}</div>
          </div>
        )}
        <ProfileTypeInput sectionName="Your Name" limit={20} text={nameRef} />
        <div className={myClasses.info}>
          This is your username. This name will be visible to your WhatsApp
          Clone contacts.
        </div>
        <ProfileTypeInput sectionName="Aboout" limit={80} text={aboutRef} />
      </div>
    </div>
  );
}
export default MyProfile;

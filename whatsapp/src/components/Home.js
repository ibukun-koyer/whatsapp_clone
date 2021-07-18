import { useHistory } from "react-router-dom";
import { useAuth } from "../context/authContext";
import classes from "./signup.module.css";
import home from "./home.module.css";
import { Fragment, useEffect, useRef } from "react";
import MainHome from "./mainHome";
import { Screen1Provider } from "../context/screen1Context";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import { useFull } from "../context/requestFullScreen";
import AddNewContact from "./addNewContact";
import { Screen2Provider } from "../context/screen2Context";
import { useOption } from "../context/showOptions";

import DropDown from "./dropDown";
import ExpandImage from "./expandImage";
import Theme from "./theme";

function Home() {
  // hooks initialization
  const bodyRef = useRef();

  const fullScreen = useFull();
  const history = useHistory();
  const option = useOption();

  const authentication = useAuth();
  // end of hook initialization

  // this effect checks to see if the user exist, if yes, stay in home directory, else redirect to login page
  useEffect(() => {
    if (!authentication.currentUser) {
      history.replace("/login");
    }
  });

  // calculate dropdown direction:
  //-->if the dropdown menu is to large to face downwards, then it faces upwards
  function positionY() {
    if (
      option.getCalculatedHeight() + option.getHeight() + option.getY() >=
      bodyRef.current.scrollHeight
    ) {
      return "up";
    } else {
      return "down";
    }
  }
  //-->if the dropdown menu is to large to face rightwards, then it faces leftwards
  function positionX() {
    if (option.getX() + 128 >= bodyRef.current.scrollWidth) {
      return "right";
    } else {
      return "left";
    }
  }
  // this is what happends when we want to close the Dropdown, methods for closing are, click somewhere else, resize
  function handleCloseOption(e) {
    if (option.getShow && e.target.id.indexOf("drop") === -1) {
      option.setShow(false);
    }
  }
  // create resize handler that removes the dropdown when screen is resized
  useEffect(() => {
    const handleResize = () => {
      // only remove if the option is on screen
      if (option.getShow) {
        option.setShow(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [option.getShow, option]);
  return (
    <Fragment>
      {/* this is the body background, the green and grey you see */}
      <div
        className={classes.bkg}
        style={{ height: "100vh" }}
        ref={bodyRef}
        onClick={handleCloseOption}
      >
        <div className={classes.green + " " + home.green}> </div>
        <div className={classes.white + " " + home.white}> </div>
      </div>
      {/* this main home tag contains the body container, where screen 1 and screen 2 stay */}
      <MainHome onClick={handleCloseOption}>
        {/* screen 2 provider is a context that stores data for the screen 2 display */}
        <Screen2Provider>
          {/* screen 1 provider is a context for screen1  */}
          <Screen1Provider>
            <Screen1 />
          </Screen1Provider>
          <Screen2 />
        </Screen2Provider>
      </MainHome>
      {/* show drop down if the dropdown option has been prompted to show, prompt is done by changing the getshow property in the showoption context */}
      {option.getShow ? (
        <DropDown
          top={`${
            positionY() === "up"
              ? option.getY() - option.getCalculatedHeight()
              : option.getY() + option.getHeight()
          }px`}
          left={
            positionX() === "left"
              ? `${option.getX() - 32}px`
              : `${option.getX() - 160}px`
          }
          options={option.getMenuOptions()}
        />
      ) : null}
      {/* render fullscreen: */}
      {/* using the fullscreen context, we can render whatever pages we want to based on the value in showFull, if showFull is -1, it does not allow you show fullscreen */}
      {fullScreen.showFull === 1 ? <AddNewContact /> : null}
      {fullScreen.showFull === 2 ? <ExpandImage /> : null}
      {fullScreen.showFull === 3 ? <Theme /> : null}
    </Fragment>
  );
}
export default Home;

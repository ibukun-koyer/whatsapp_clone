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

function Home() {
  const bodyRef = useRef();

  const fullScreen = useFull();
  const history = useHistory();
  const option = useOption();

  const authentication = useAuth();
  useEffect(() => {
    if (!authentication.currentUser) {
      history.replace("/login");
    }
  });

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
  function positionX() {
    console.log(option.getX() + 30, bodyRef.current.scrollWidth);
    if (option.getX() + 128 >= bodyRef.current.scrollWidth) {
      return "right";
    } else {
      return "left";
    }
  }
  function handleCloseOption(e) {
    // console.log(e.target);
    if (option.getShow && e.target.id.indexOf("drop") === -1) {
      option.setShow(false);
    }
  }
  useEffect(() => {
    const handleResize = () => {
      if (option.getShow) {
     
        option.setShow(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [option.getShow, option]);
  return (
    <Fragment>
      <div
        className={classes.bkg}
        style={{ height: "100vh" }}
        ref={bodyRef}
        onClick={handleCloseOption}
      >
        <div className={classes.green + " " + home.green}> </div>
        <div className={classes.white + " " + home.white}> </div>
      </div>
      <MainHome onClick={handleCloseOption}>
        <Screen2Provider>
          <Screen1Provider>
            <Screen1 />
          </Screen1Provider>
          <Screen2 />
        </Screen2Provider>
      </MainHome>
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
      {fullScreen.showFull === 1 ? <AddNewContact /> : null}
      {fullScreen.showFull === 2 ? <ExpandImage /> : null}
    </Fragment>
  );
}
export default Home;

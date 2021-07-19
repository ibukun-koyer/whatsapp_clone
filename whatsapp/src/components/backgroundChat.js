import { Fragment } from "react";
import classes from "./chatPage.module.css";
import {
  darkCombination,
  lightCombination,
} from "./helperFiles/chatBackgroundColors";

function BackgroundChat({ shouldNotDecreaseHeight, settings }) {
  return (
    <Fragment>
      <div
        className={
          classes.backgroundColor +
          " " +
          (shouldNotDecreaseHeight ? "" : classes.decreaseHeight)
        }
        style={{
          backgroundColor:
            settings.theme === "light"
              ? lightCombination[parseInt(settings.lightChatBkg)].mainColor
              : darkCombination[parseInt(settings.darkChatBkg)].mainColor,
        }}
      ></div>
      {settings.showDoodle === true ? (
        <div
          className={
            classes.background +
            " " +
            (shouldNotDecreaseHeight ? "" : classes.decreaseHeight)
          }
          style={{
            filter:
              settings.theme === "light"
                ? `invert(${
                    lightCombination[parseInt(settings.lightChatBkg)]
                      .doodleInvert
                  })`
                : `invert(${
                    darkCombination[parseInt(settings.darkChatBkg)].doodleInvert
                  })`,
          }}
        ></div>
      ) : null}
    </Fragment>
  );
}

export default BackgroundChat;

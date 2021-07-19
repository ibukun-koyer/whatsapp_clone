import myClasses from "./chatBackground.module.css";
import classes from "./settings.module.css";
import { useScreen1 } from "../context/screen1Context";
import page from "./page.module.css";
import { defaultUrl, pageNames } from "./helperFiles/globals";
import PageHeader from "./pageHeader";
import { useEffect, useRef, useState } from "react";
import { useFull } from "../context/requestFullScreen";
import { useScreen2 } from "../context/screen2Context";
import { useAuth } from "../context/authContext";
import {
  darkCombination,
  lightCombination,
} from "./helperFiles/chatBackgroundColors";

function ChatBacground() {
  const context = useScreen2();
  const ctx = useScreen1();
  const authentication = useAuth();

  const isLightMode = authentication.settings.theme === "light";
  const [selected, setSelected] = useState(
    isLightMode
      ? parseInt(authentication.settings.lightChatBkg)
      : parseInt(authentication.settings.darkChatBkg)
  );
  const currentSelection = useRef(selected);
  const obj = { ...authentication.settings };

  function shallowUpdateSettings(index) {
    if (isLightMode) {
      obj.lightChatBkg = index;
    } else {
      obj.darkChatBkg = index;
    }
    authentication.setSettings(obj);
  }
  function updateSettingColor(index) {
    shallowUpdateSettings(index);
    localStorage.setItem("settings", JSON.stringify(obj));
    currentSelection.current = index;
    setSelected(index);
  }
  function updateSettingCheck() {
    obj.showDoodle = !obj.showDoodle;
    authentication.setSettings(obj);
    localStorage.setItem("settings", JSON.stringify(obj));
  }
  useEffect(() => {
    if (
      context.state.type === "" &&
      ctx.state.curr === pageNames.chatBackground
    ) {
      context.setPage({ type: "demo" });
    }
  });
  return (
    <div
      className={
        (ctx.state.curr === pageNames.chatBackground
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
        header="Set Chat Wallpaper"
        onClick={() => {
          ctx.setPage({
            prev: pageNames.chatBackground,
            curr: pageNames.settings,
          });
          if (context.state.type === "demo") context.setPage({ type: "" });
        }}
      />
      <div className={myClasses.containBody}>
        <div className={myClasses.containCheckBox}>
          <input
            type="checkbox"
            id="doodle"
            checked={authentication.settings.showDoodle}
            onChange={() => updateSettingCheck()}
          />
          <label htmlFor="doodle">Add WhatsApp Doodles</label>
        </div>

        <div className={myClasses.gridContainer}>
          {[
            ...(() =>
              authentication.settings.theme === "light"
                ? lightCombination
                : darkCombination)(),
          ].map((color, index) => {
            return (
              <div
                key={color.mainColor}
                className={`${myClasses.gridItem} ${
                  index === selected ? myClasses.selected : ""
                }`}
                style={{
                  backgroundColor: color.mainColor,
                }}
                onClick={() => setSelected(index)}
                onMouseEnter={() => shallowUpdateSettings(index)}
                onMouseLeave={() =>
                  shallowUpdateSettings(currentSelection.current)
                }
                onClick={() => updateSettingColor(index)}
              >
                {index === 0 ? "Default" : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default ChatBacground;

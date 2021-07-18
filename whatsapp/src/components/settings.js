import classes from "./settings.module.css";
import { useScreen1 } from "../context/screen1Context";
import page from "./page.module.css";
import { defaultUrl, pageNames } from "./helperFiles/globals";
import PageHeader from "./pageHeader";
import { useEffect, useState } from "react";
import CreateSettingOption from "./createSettingOption";
import { useFull } from "../context/requestFullScreen";

function Settings() {
  const fullscreen = useFull();
  function handleSetTheme() {
    fullscreen.provideFullScreen(3);
  }

  const [info, setInfo] = useState(undefined);
  const context = useScreen1();

  useEffect(() => {
    if (context.myInfo) {
      setInfo(context.myInfo);
    }
  }, [context.myInfo]);
  return (
    <div
      className={
        (context.state.curr === pageNames.settings
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
      <PageHeader
        header="Settings"
        onClick={() => {
          context.setPage({
            prev: pageNames.settings,
            curr: pageNames.allMessages,
          });
        }}
      />

      <div
        className={classes.myInfo}
        onClick={() => {
          context.setPage({
            prev: pageNames.settings,
            curr: pageNames.myProfile,
          });
        }}
      >
        <div className={classes.containImage}>
          <div>
            <img src={info ? context.myInfo.url : defaultUrl} />
          </div>
        </div>
        <div className={classes.containText}>
          <div className={classes.topText}>
            {info ? info.username : "Username"}
          </div>
          <div className={classes.bottomText}>
            {info ? info.status : "Status"}
          </div>
        </div>
      </div>

      <CreateSettingOption title="theme" onClick={handleSetTheme}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1l3.22 3.22h4.56v4.56L23 12l-3.22 3.22v4.56h-4.56L12 23l-3.22-3.22H4.22v-4.56L1 12l3.22-3.22V4.22h4.56L12 1zm0 5v12c3.31 0 6-2.69 6-6a6.005 6.005 0 0 0-5.775-5.996L12 6z"
            fill="currentColor"
          ></path>
        </svg>
      </CreateSettingOption>
      <CreateSettingOption title="chat wallpaper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            fill="currentColor"
            d="M4.9 5.9h6.4V4.1H4.9c-1 0-1.8.8-1.8 1.8v6.4h1.8V5.9zm5.3 8l-3.6 4.4h10.7l-2.7-3.6-1.8 2.4-2.6-3.2zm6.2-4c0-.7-.6-1.3-1.3-1.3s-1.3.6-1.3 1.3.6 1.3 1.3 1.3 1.3-.6 1.3-1.3zm2.7-5.8h-6.4v1.8h6.4v6.4h1.8V5.9c0-1-.8-1.8-1.8-1.8zm0 16h-6.4v1.8h6.4c1 0 1.8-.8 1.8-1.8v-6.4h-1.8v6.4zM4.9 13.7H3.1v6.4c0 1 .8 1.8 1.8 1.8h6.4v-1.8H4.9v-6.4z"
          ></path>
        </svg>
      </CreateSettingOption>
    </div>
  );
}
export default Settings;

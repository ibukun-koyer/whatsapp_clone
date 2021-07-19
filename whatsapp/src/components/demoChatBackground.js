import classes from "./chatPage.module.css";
import external from "./allMessages.module.css";
import BackgroundChat from "./backgroundChat";
import { useAuth } from "../context/authContext";

function DemoChatBackground() {
  const authentication = useAuth();
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className={external.top + " " + external.darkGray + " " + classes.nav}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--fontDefaultColor)",
        }}
      >
        Wallpaper preview
      </div>
      <BackgroundChat
        shouldNotDecreaseHeight={true}
        settings={authentication.settings}
      />
    </div>
  );
}
export default DemoChatBackground;

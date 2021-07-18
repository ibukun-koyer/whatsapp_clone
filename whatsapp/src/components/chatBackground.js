import myClasses from "./chatBackground.module.css";
import classes from "./settings.module.css";
import { useScreen1 } from "../context/screen1Context";
import page from "./page.module.css";
import { defaultUrl, pageNames } from "./helperFiles/globals";
import PageHeader from "./pageHeader";
import { useEffect, useState } from "react";
import { useFull } from "../context/requestFullScreen";
function ChatBacground() {
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
        (context.state.curr === pageNames.chatBackground
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
        header="Chat Background"
        onClick={() => {
          context.setPage({
            prev: pageNames.chatBackground,
            curr: pageNames.settings,
          });
        }}
      />
    </div>
  );
}
export default ChatBacground;

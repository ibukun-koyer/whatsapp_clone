import classes from "./screen2.module.css";
import DemoPage from "./screen2demo";
import { useScreen2 } from "../context/screen2Context";
import ChatPage from "./chatPage";
import { ReplyProvider } from "../context/replyContext";
import FileSend from "./fileSend";
function Screen2() {
  const context = useScreen2();
  return (
    <div className={classes.screen}>
      <ReplyProvider>
        {context.state.type === "" ? (
          <DemoPage />
        ) : (
          <ChatPage key={context.state.email} />
        )}
        {context.imageUrl.length ? (
          <FileSend
            setImageUrl={context.setImageUrl}
            imageUrl={context.imageUrl}
            meetingRoom={context.getMeetingRoom()}
          />
        ) : null}
      </ReplyProvider>
    </div>
  );
}
export default Screen2;

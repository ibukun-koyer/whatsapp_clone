import classes from "./screen2.module.css";
import DemoPage from "./screen2demo";
import { useScreen2 } from "../context/screen2Context";
import ChatPage from "./chatPage";
import { ReplyProvider } from "../context/replyContext";
import FileSend from "./fileSend";
import DemoChatBackground from "./demoChatBackground";

function Screen2() {
  const context = useScreen2();

  return (
    <div className={classes.screen}>
      {/* replyprovider is a context that keeps track of your reply before you send it, i.e the reply above the message you are composing*/}
      <ReplyProvider>
        {/* if no contact or group has been selected, render the landing page/demo page */}
        {context.state.type === "" ? (
          <DemoPage />
        ) : context.state.type === "demo" ? (
          <DemoChatBackground />
        ) : (
          // else we render the chat page
          <ChatPage
            key={
              context.state.email
                ? context.state.email
                : context.state.createdAt
            }
          />
        )}
        {/* if we are ready to send an image, then fileSend does all the image sending functionalities  */}
        {context.imageUrl.length ? (
          <FileSend
            setImageUrl={context.setImageUrl}
            imageUrl={context.imageUrl}
            meetingRoom={context.getMeetingRoom()}
            contactType={context.state.type}
          />
        ) : null}
      </ReplyProvider>
    </div>
  );
}
export default Screen2;

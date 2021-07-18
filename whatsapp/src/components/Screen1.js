import classes from "./screen1.module.css";
import AllMessages from "./AllMessages";
import ShowContacts from "./showContacts";
import { useScreen1 } from "../context/screen1Context";
import { pageNames } from "./helperFiles/globals";
import AddGroup from "./AddGroup";
import GroupInfo from "./groupInfo";
import MyProfile from "./myProfile";
import Settings from "./settings";
import ChatBacground from "./chatBackground";
function Screen1() {
  const context = useScreen1();

  return (
    // render screen 1 and make changes to display of screen 1
    <div className={classes.screen}>
      {/* using screen 1 context, we set curr and prev when changing pages to ensure that we can animate prev when curr comes in */}
      {context.state.curr === pageNames.allMessages ||
      context.state.prev === pageNames.allMessages ? (
        <AllMessages />
      ) : null}
      {context.state.curr === pageNames.showContacts ||
      context.state.prev === pageNames.showContacts ? (
        <ShowContacts />
      ) : null}
      {context.state.curr === pageNames.addGroup ||
      context.state.prev === pageNames.addGroup ? (
        <AddGroup />
      ) : null}
      {context.state.curr === pageNames.groupInfo ||
      context.state.prev === pageNames.groupInfo ? (
        <GroupInfo />
      ) : null}
      {context.state.curr === pageNames.myProfile ||
      context.state.prev === pageNames.myProfile ? (
        <MyProfile />
      ) : null}
      {context.state.curr === pageNames.settings ||
      context.state.prev === pageNames.settings ? (
        <Settings />
      ) : null}
      {context.state.curr === pageNames.chatBackground ||
      context.state.prev === pageNames.chatBackground ? (
        <ChatBacground />
      ) : null}
    </div>
  );
}
export default Screen1;

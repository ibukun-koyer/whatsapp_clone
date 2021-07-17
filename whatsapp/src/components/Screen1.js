import classes from "./screen1.module.css";
import AllMessages from "./AllMessages";
import ShowContacts from "./showContacts";
import { useScreen1 } from "../context/screen1Context";
import { pageNames } from "./helperFiles/globals";
import AddGroup from "./AddGroup";
import GroupInfo from "./groupInfo";
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
    </div>
  );
}
export default Screen1;

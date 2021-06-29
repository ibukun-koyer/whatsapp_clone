import { Fragment } from "react";
import classes from "./scrollBtn.module.css";
function ScrollBtn({ shouldScrollToBottom, bodyRef, setScrollToBottom }) {
  return (
    <Fragment>
      {shouldScrollToBottom ? null : (
        <div
          className={classes.scrollDown}
          onClick={() => {
            // shouldScrollToBottom.curr= true;
            if (bodyRef.current) {
              bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
            }
            // setChanged(true);
            setScrollToBottom(true);
          }}
        >
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </div>
      )}
    </Fragment>
  );
}
export default ScrollBtn;

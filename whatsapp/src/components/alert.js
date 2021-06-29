import classes from "./signup.module.css";
function Alert({ color, header, msg, onClick, closeTxt }) {
  return (
    <div
      className={
        color === "red"
          ? classes.red + " " + classes.alert
          : classes.green_ + " " + classes.alert
      }
    >
      <h3>{header}</h3>
      <div>{msg}</div>
      <hr />
      <div className={classes.buttonAlert}>
        <button onClick={onClick} className={classes.btnError}>
          {closeTxt}
        </button>
      </div>
    </div>
  );
}
export default Alert;

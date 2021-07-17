import classes from "./signup.module.css";
import Alert from "./alert";
function AuthBkg({ serverError, setServerError, children }) {
  return (
    <div>
      {serverError === "" ? null : (
        <Alert
          color="red"
          header="Oops, an error occured"
          msg={serverError}
          onClick={() => setServerError("")}
          closeTxt="close"
        />
      )}
      <div className={classes.title}>
        <img
          src={process.env.PUBLIC_URL + "/whatsapp-icon-png-13.png"}
          alt="whatsapp icon"
          className={classes.icon}
        />
        <span>whatsapp WEB</span>
      </div>
      <div className={classes.bkg} style={{ height: "1000px" }}>
        <div className={classes.green}> </div>
        <div className={classes.white}> </div>
      </div>
      <div className={classes.form}>{children}</div>
    </div>
  );
}
export default AuthBkg;

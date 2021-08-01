import { useAuth } from "../context/authContext";
import classes from "./screen2.module.css";

function DefaultPage() {
  const authentication = useAuth();
  return (
    <div className={classes.dummyPage}>
      <div className={classes.demoImage}>
        <div>
          <img
            src={
              authentication.settings.theme === "light"
                ? process.env.PUBLIC_URL + "/light_mode_phone_icon.jpg"
                : process.env.PUBLIC_URL + "/dark_mode_phone_icon.jpg"
            }
            alt="keep your phone connected"
          />
        </div>
      </div>
      <div className={classes.demoText}>
        <h1 className={classes.demoHeader}>Keep your device connected</h1>
        <div className={classes.demoDes}>
          WhatsApp clone connects you to a database to foster communication. To
          reduce data usage, connect to WI-FI.
        </div>
        <div className={classes.demoDes + " " + classes.getWhatsapp}>
          <i className="fa fa-laptop "></i> WhatsApp is available for windows.{" "}
          <a
            target="_blank"
            href="https://www.whatsapp.com/download"
            className={classes.refToDownload}
            rel="noreferrer"
          >
            Get it here
          </a>
        </div>
      </div>
    </div>
  );
}
export default DefaultPage;

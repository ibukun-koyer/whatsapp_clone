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
                ? "https://web.whatsapp.com/img/intro-connection-hq-light_9466a20e6d2921a21ac7ab82419be157.jpg"
                : "https://web.whatsapp.com/img/intro-connection-dark_0ee01153183b5ebd9b296399cc2104b0.jpg"
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
            href="https://www.whatsapp.com/download"
            className={classes.refToDownload}
          >
            Get it here
          </a>
        </div>
      </div>
    </div>
  );
}
export default DefaultPage;

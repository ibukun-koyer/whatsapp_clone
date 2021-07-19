import myClasses from "./theme.module.css";
import classes from "./addNewContact.module.css";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import CenteredBtn from "./centeredBtn";
import form from "./signup.module.css";
import useKey from "./hooks/useKey";
import { useFull } from "../context/requestFullScreen";
import { useRef, useState } from "react";
import { useAuth } from "../context/authContext";

function Theme() {
  const authentication = useAuth();
  const fullScreen = useFull();
  const [animateOff, setAnimateOff] = useState(false);
  const selected = useRef();
  useKey("Escape", () => {
    setAnimateOff(true);
  });
  function handleCancel(e) {
    e.preventDefault();
    setAnimateOff(true);
  }

  function changeMode(theme) {
    const obj = { ...authentication.settings };
    obj.theme = theme;

    localStorage.setItem("settings", JSON.stringify(obj));
    authentication.setSettings(obj);
  }
  function changeTheme(e) {
    e.preventDefault();
    if (selected.current.checked) {
      changeMode("light");
    } else {
      changeMode("dark");
    }
    setAnimateOff(true);
  }
  return (
    <div>
      <div
        className={
          classes.fullScreen + " " + (animateOff ? classes.animateOff : "")
        }
        key={animateOff}
        onAnimationEnd={() => {
          if (animateOff) {
            fullScreen.provideFullScreen(0);
          }
        }}
      >
        <div className={`${form.form} ${myClasses.updatedForm}`}>
          <h4 className={myClasses.header}>Choose theme</h4>
          <form className={myClasses.inputs}>
            <div>
              <input
                type="radio"
                name="theme"
                id="light"
                defaultChecked={authentication.settings.theme === "light"}
                ref={selected}
              />
              <label htmlFor="light"> Light</label>
            </div>
            <div>
              <input
                type="radio"
                name="theme"
                id="dark"
                defaultChecked={authentication.settings.theme === "dark"}
              />
              <label htmlFor="dark"> Dark</label>
            </div>
            <div className={myClasses.containBtn}>
              <button
                className={`${myClasses.defaultBtn} ${myClasses.btn1}`}
                onClick={handleCancel}
              >
                CANCEL
              </button>
              <button
                className={`${myClasses.defaultBtn} ${myClasses.btn2}`}
                onClick={changeTheme}
              >
                OK
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Theme;

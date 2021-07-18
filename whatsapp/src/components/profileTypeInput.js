import { Fragment, useEffect } from "react";
import { useRef, useState } from "react";
import classes from "./profileTypeInput.module.css";

function ProfileTypeInput({ sectionName, limit, text }) {
  const inputRef = useRef();
  const [clicked, setClicked] = useState(false);

  const [textLength, setTextLenght] = useState(limit - text.current.length);
  const initialHeight = useRef();

  function calculateRows() {
    if (!initialHeight.current) {
      initialHeight.current = parseInt(
        window.getComputedStyle(inputRef.current).height
      );
    }
    if (inputRef.current.rows != 1)
      inputRef.current.rows = `${parseInt(inputRef.current.rows) - 1}`;

    if (
      inputRef.current.scrollHeight >
      parseInt(window.getComputedStyle(inputRef.current).height)
    ) {
      inputRef.current.rows = `${
        inputRef.current.scrollHeight / initialHeight.current + 1
      }`;
    }
  }
  function handleTextChange() {
    let newLength = inputRef.current.value.length;
    if (newLength <= limit) {
      setTextLenght(limit - newLength);
    }
    calculateRows();
  }
  function handleSaveText() {
    if (inputRef.current.value.length !== 0) {
      text.current = inputRef.current.value;
      setClicked(false);
    }
  }
  useEffect(() => {
    if (inputRef.current) calculateRows();
  });
  return (
    <div className={classes.body}>
      <div className={classes.headerText}>{sectionName}</div>
      <div className={classes.inputContainer}>
        <div
          className={`${classes.relativeBody} ${
            clicked ? classes.clickedBody : ""
          }`}
        >
          {clicked ? (
            <Fragment>
              <textarea
                defaultValue={text.current}
                className={classes.input}
                ref={inputRef}
                rows={"1"}
                // rows={calculateRows()}
                maxLength={limit}
                onChange={handleTextChange}
              />
              <div className={classes.absolute}>
                <span className={classes.remainingChars}>{textLength}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  onClick={handleSaveText}
                >
                  <path
                    fill="currentColor"
                    d="M9 17.2l-4-4-1.4 1.3L9 19.9 20.4 8.5 19 7.1 9 17.2z"
                  ></path>
                </svg>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className={classes.currentText}>{text.current}</div>
              <div className={classes.absolute}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  onClick={() => setClicked(true)}
                >
                  <path
                    fill="currentColor"
                    d="M3.95 16.7v3.4h3.4l9.8-9.9-3.4-3.4-9.8 9.9zm15.8-9.1c.4-.4.4-.9 0-1.3l-2.1-2.1c-.4-.4-.9-.4-1.3 0l-1.6 1.6 3.4 3.4 1.6-1.6z"
                  ></path>
                </svg>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfileTypeInput;

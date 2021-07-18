import { useCallback, useEffect, useRef, useState } from "react";
import classes from "./fileSend.module.css";
import SearchBarOption2 from "./SearchBarOption2";
import SendSVG from "./SVG/sendSVG";
import btn from "./addGroup.module.css";
import Alert from "./alert";
import { onImageChange, onImageSubmit } from "./helperFiles/imageHandler";
import { useReply } from "../context/replyContext";
import firebase from "firebase";
import { useAuth } from "../context/authContext";
import { replaceInvalid } from "./helperFiles/replaceEmailInvalid";
import { ImageAndVideo } from "./helperFiles/messageTypeTemplates";
import useKey from "./hooks/useKey";

const Url = 0;
const type = 1;
const caption = 2;
function FileSend({ setImageUrl, imageUrl, meetingRoom, contactType }) {
  const authentication = useAuth();
  const reply = useReply();
  const animationDir = useRef();
  const files = useRef({
    ...imageUrl.map((curr) => {
      return [...curr, ""];
    }),
  });
  console.log(files.current);

  const [hover, setHover] = useState("");
  //start of experimental section
  function handleClick(e) {
    e.stopPropagation();
    fileSelect.current.click();
  }
  const [imageError, setImageError] = useState("");
  const fileSelect = useRef();

  const arr = Object.keys(files.current);
  function handleImageSelected(e) {
    const list_of_files = [];
    let broken = false;
    for (let i of e.target.files) {
      const fileObj = i;
      let url = onImageChange(fileObj, setImageError);
      if (url) {
        list_of_files.push([url, i.type.slice(0, 5), ""]);
      } else {
        broken = true;
        break;
      }
    }
    if (!broken) {
      let arr_sorted = arr
        .map((curr) => {
          return parseInt(curr);
        })
        .sort((a, b) => a - b);

      let last = parseInt(arr_sorted[arr_sorted.length - 1]);

      let index = 0;
      while (index < list_of_files.length) {
        files.current[last + index + 1] = list_of_files[index];
        index++;
      }
      if (index > 0) {
        setCurrentlySelected(`${last + 1}`);
        console.log(files.current);
      }
    }
  }
  //end of experimental section

  const [currentlySelected, setCurrentlySelected] = useState("0");
  const [valueChanged, setChanged] = useState(0);
  const ref = useRef();
  function inputChange() {
    files.current[currentlySelected][caption] = ref.current.value;
    console.log(files.current[currentlySelected][caption]);
  }
  const direction = useCallback(
    (curr) => {
      console.log(curr, currentlySelected);
      if (parseInt(curr) < parseInt(currentlySelected)) {
        animationDir.current = "forward";
      } else if (parseInt(curr) > parseInt(currentlySelected)) {
        animationDir.current = "backward";
      }
    },
    [currentlySelected]
  );
  useEffect(() => {
    const keydown = (e) => {
      if (e.code === "ArrowRight") {
        const nextImage = arr[arr.indexOf(currentlySelected) + 1];
        console.log(nextImage, arr.indexOf(currentlySelected) + 1);
        if (nextImage) {
          direction(nextImage);
          setCurrentlySelected(nextImage);
        }
      } else if (e.code === "ArrowLeft") {
        const nextImage = arr[arr.indexOf(currentlySelected) - 1];
        console.log(nextImage, arr.indexOf(currentlySelected) - 1);
        if (nextImage) {
          direction(nextImage);
          setCurrentlySelected(nextImage);
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [direction, arr, currentlySelected]);

  const [completed, setCompleted] = useState(0);

  function handleSend() {
    for (let i in files.current) {
      const replyObj = reply.isClosed()
        ? ""
        : {
            username: reply.getUsername(),
            message: reply.getMessage(),
            owner: reply.getEmail(),
            type: reply.getType(),
          };
      if (!reply.isClosed()) {
        reply.close();
      }
      function onSaved(url) {
        const message = new ImageAndVideo(
          replaceInvalid(authentication.currentUser.email),
          replyObj,
          url,
          files.current[i][caption],
          files.current[i][type]
        );
        console.log(replyObj);
        const sendRef = firebase
          .database()
          .ref(`/${contactType}s/${meetingRoom}/messages`)
          .child(Math.ceil(Date.now() / 1000 + parseInt(i)) * -1);

        sendRef.set(message.message);
        console.log(Math.ceil(Date.now() / 1000 + parseInt(i)), i);

        sendRef.update({ data: { d: false } });
        setCompleted((prev) => prev + 1);
      }
      function onError(e) {
        setImageError(e);
      }
      onImageSubmit(
        "",
        files.current[i][Url],
        onSaved,
        onError,
        files.current[i][type]
      );
    }
  }
  useEffect(() => {
    console.log(completed);
    if (completed === arr.length) {
      setImageUrl([]);
    }
  }, [completed, setImageUrl, arr.length]);

  useKey("Enter", () => {
    console.log(document.activeElement === ref.current);
    if (ref.current.value.length && document.activeElement === ref.current) {
      handleSend();
    }
  });
  return (
    <div className={classes.screen}>
      {imageError === "" ? null : (
        <Alert
          color={"red"}
          header={"Oops, an error occured"}
          msg={imageError}
          onClick={() => setImageError("")}
          closeTxt="close"
        />
      )}

      <nav className={classes.nav}>
        <i
          className={`fa fa-times-thin fa-2x ${classes.close}`}
          aria-hidden="true"
          onClick={() => setImageUrl([])}
        ></i>
        <h5 className={classes.previewTxt}>Preview</h5>
      </nav>
      <div className={classes.containImages}>
        {files.current[currentlySelected][type] === "image" ? (
          <img
            key={files.current[currentlySelected][Url]}
            src={files.current[currentlySelected][Url]}
            alt="displayed "
            className={
              animationDir.current === "forward"
                ? classes.forward
                : animationDir.current === "backward"
                ? classes.backward
                : ""
            }
          />
        ) : (
          <video
            controls
            height={"100%"}
            src={files.current[currentlySelected][Url]}
            key={files.current[currentlySelected][Url]}
            className={
              animationDir.current === "forward"
                ? classes.forward
                : animationDir.current === "backward"
                ? classes.backward
                : ""
            }
          >
            The browser does not support videos.
          </video>
        )}
      </div>
      <SearchBarOption2
        objRef={ref}
        valueChanged={valueChanged}
        setChanged={setChanged}
        placeholder={"Add a caption..."}
        extraStyling={{ width: "70%" }}
        centered
        onChange={inputChange}
      />

      <footer className={classes.footerWrap}>
        <div className={classes.footer}>
          {arr.map((curr, index) => {
            return (
              <div
                className={
                  classes.imageHolder +
                  " " +
                  (currentlySelected === curr ? classes.selected : "")
                }
                style={{ position: "relative" }}
                key={index}
                onClick={() => {
                  direction(curr);
                  setCurrentlySelected(curr);
                  ref.current.value = files.current[curr][caption];
                }}
                onMouseEnter={() => setHover(curr)}
                onMouseLeave={() => {
                  if (hover === curr) {
                    setHover("");
                  }
                }}
              >
                {hover === curr ? (
                  <div className={classes.hoverBkg}>
                    <i
                      className="fa fa-times-thin fa-2x"
                      aria-hidden="true"
                      style={{ fontSize: "1.5rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        delete files.current[curr];
                        if (curr === currentlySelected) {
                          const nextImage =
                            arr[arr.indexOf(currentlySelected) + 1];
                          const prevImage =
                            arr[arr.indexOf(currentlySelected) - 1];
                          if (nextImage) {
                            direction(curr);
                            setCurrentlySelected(nextImage);
                          } else if (prevImage) {
                            direction(curr);
                            setCurrentlySelected(prevImage);
                          } else {
                            setImageUrl([]);
                          }
                        } else {
                          setHover("");
                        }
                      }}
                    ></i>
                  </div>
                ) : null}
                {files.current[curr][type] === "image" ? (
                  <img src={files.current[curr][Url]} alt="selected" />
                ) : (
                  <video
                    src={files.current[curr][Url]}
                    height={"100%"}
                    width="100%"
                  >
                    The browser does not support videos.
                  </video>
                )}
              </div>
            );
          })}
          <div
            className={classes.imageHolder}
            style={{
              backgroundColor: "var(--profileInputBkgColor)",
              flexDirection: "column",
              color: "var(--myReplyBkg)",
            }}
            onClick={handleClick}
          >
            <div>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </div>
            <span style={{ fontWeight: "bold", fontSize: "0.7rem" }}>
              ADD FILE
            </span>
          </div>
          <button
            className={btn.nextBtn + " " + classes.send}
            onClick={handleSend}
          >
            <SendSVG />
          </button>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileSelect}
            accept="image/*,video/*"
            multiple
            onInput={handleImageSelected}
          />
        </div>
      </footer>
    </div>
  );
}
export default FileSend;

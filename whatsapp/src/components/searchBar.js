import classes from "./allMessages.module.css";
import { useState, useRef } from "react";

function SearchBar({ def, placeholder, shadow }) {
  const [searchIconClicked, setSearchIconClick] = useState(def);
  const searchVal = useRef();
  function onBlur() {
    if (searchVal.current.value === "") {
      setSearchIconClick(false);
    }
  }
  return (
    <div
      className={
        searchIconClicked === false
          ? classes.top + " " + classes.lightGray
          : classes.top +
            " " +
            classes.lightGray +
            " " +
            classes.noPad +
            " " +
            (shadow === true ? classes.shadow : "")
      }
      style={
        searchIconClicked === false ? { padding: "0.5rem" } : { padding: "0" }
      }
    >
      <div
        style={{ width: "100%" }}
        className={searchIconClicked === false ? "" : classes.maxHeight}
      >
        <input
          type="text"
          placeholder={placeholder}
          className={
            classes.searchBar +
            " " +
            (searchIconClicked === false
              ? ""
              : classes.noBorderRad + " " + classes.maxHeight)
          }
          onFocus={() => setSearchIconClick(true)}
          ref={searchVal}
          onBlur={onBlur}
        />

        <i
          className={`${
            searchIconClicked === false ? "fa fa-search" : "fa fa-arrow-left"
          } ${
            searchIconClicked === false
              ? classes.searchIcon
              : classes.searchIconArrow
          }`}
          aria-hidden="true"
          onClick={() => setSearchIconClick((prev) => !prev)}
        ></i>
      </div>
    </div>
  );
}
export default SearchBar;

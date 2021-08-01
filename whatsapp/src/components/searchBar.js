import classes from "./allMessages.module.css";
import { useState, useRef } from "react";

function SearchBar({ def, placeholder, shadow, editFxn = () => {} }) {
  // def means default state, so basically saying is searchbar focused by default
  const [searchIconClicked, setSearchIconClick] = useState(def);
  // stores the value inside the search bar
  const searchVal = useRef();
  // whenever you focuse out of the search bar, i.e clicking away from search
  function onBlur() {
    // only focus out when there is no text inside search bar, else, dont focus out
    if (searchVal.current.value === "") {
      setSearchIconClick(false);
    }
  }
  const clickTimeout = useRef(undefined);
  const timeout = 10;

  function isValidClick(fxn) {
    if (clickTimeout.current === undefined) {
      clickTimeout.current = new Date().getTime();
      fxn();
    } else {
      if (
        Math.abs(clickTimeout.current - new Date().getTime()) >=
        60 * timeout
      ) {
        clickTimeout.current = new Date().getTime();
        fxn();
      }
    }
  }
  return (
    // defining the searchbar section based on if it is focused or not
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
        {/* the input section */}
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
          onFocus={() => {
            isValidClick(() => {
              setSearchIconClick(true);
            });
          }}
          ref={searchVal}
          onBlur={() => {
            isValidClick(onBlur);
          }}
          onChange={() => {
            editFxn(
              searchVal.current && searchVal.current.value
                ? searchVal.current.value
                : ""
            );
          }}
        />
        {/* search icon  */}
        <i
          className={`${
            searchIconClicked === false ? "fa fa-search" : "fa fa-arrow-left"
          } ${
            searchIconClicked === false
              ? classes.searchIcon
              : classes.searchIconArrow
          }`}
          aria-hidden="true"
          onClick={() => {
            isValidClick(() => setSearchIconClick((prev) => !prev));
          }}
        ></i>
      </div>
    </div>
  );
}
export default SearchBar;

import classes from "./dropDown.module.css";
import { useOption } from "../context/showOptions";

// this function defines the dropdown design
function DropDown({ top, left, options }) {
  const option = useOption();
  // size and width calculated based on the values we have sent to the option context by dropdownmenu
  return (
    <div
      style={{
        top,
        left,
        height: `${option.getCalculatedHeight()}px`,
        display: "flex",
        justifyContent: "space-evenly",
        flexDirection: "column",
        zIndex: "2",
      }}
      className={classes.menu}
    >
      {/* this prints out all the options */}
      {options.map((opt, index) => {
        return (
          <div
            style={{
              paddingLeft: `${option.getMarginSize()}rem`,
              paddingRight: `${option.getMarginSize()}rem`,
            }}
            key={index}
            className={classes.menuItem}
            onClick={() => {
              option.setOutput(opt);
            }}
          >
            {opt}
          </div>
        );
      })}
    </div>
  );
}
export default DropDown;

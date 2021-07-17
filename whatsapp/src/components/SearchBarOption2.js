import classes from "./groupInfo.module.css";
function SearchBarOption2({
  objRef,
  valueChanged,
  setChanged,
  placeholder,
  showCharacterCount,
  extraStyling,
  centered,
  onChange,
}) {
  // onchange to input, check to see that the string is less than 25
  function handleChange() {
    if (objRef.current.value.length >= 25) {
      objRef.current.value = objRef.current.value.slice(0, 25);
    }

    setChanged(objRef.current.value.length);
    if (onChange) {
      onChange();
    }
  }
  return (
    <div
      className={classes.wrapTitle}
      style={centered ? { display: "flex", justifyContent: "center" } : {}}
    >
      <input
        type="text"
        className={classes.title}
        style={extraStyling ? extraStyling : {}}
        ref={objRef}
        onChange={handleChange}
      />
      {showCharacterCount ? (
        <span className={classes.maxChar}>{25 - valueChanged}</span>
      ) : null}

      <span
        className={
          classes.placeholder +
          " " +
          (valueChanged === 0
            ? classes.undoPlaceholderAnim
            : classes.animatePlaceholder)
        }
        style={
          extraStyling
            ? {
                ...extraStyling,
                margin: centered ? "0 auto" : "0",
                left: centered ? "20px" : "2px",
              }
            : {}
        }
        onClick={() => objRef.current.focus()}
      >
        {placeholder}
      </span>
    </div>
  );
}
export default SearchBarOption2;

import classes from "./hoverAnimation.module.css";
let fontSize = 0.8;
let padding = 0.7;
let paddingLeftRight = 1.2;
function HoverSVG({ text, position }) {
  return (
    <div
      style={{
        fontSize: `${fontSize}rem`,
        position: "absolute",
        bottom: `calc(${position}rem + 26.5px - ${
          fontSize / 2
        }rem - ${padding}rem)`,
        left: "4rem",
        backgroundColor: "rgba(30,30 ,30, 0.7)",
        borderRadius: "2rem",
        color: "white",
        padding: `${padding}rem`,
        paddingRight: `${paddingLeftRight}rem`,
        paddingLeft: `${paddingLeftRight}rem`,
        fontFamily:
          '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-seri',
        width: "max-content",
        zIndex: "5",
      }}
      className={classes.anim}
    >
      {text}
    </div>
  );
}
export default HoverSVG;

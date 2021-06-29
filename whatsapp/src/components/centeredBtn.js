import classes from "./signup.module.css";
import { Button } from "react-bootstrap";
function CenteredBtn({ children, variant, onClick }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        variant={variant}
        type="submit"
        className={classes.btn}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
}
export default CenteredBtn;

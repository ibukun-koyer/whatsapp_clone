import classes from "./showContacts.module.css";
function PageHeader({ onClick, header }) {
  return (
    <div>
      <div className={classes.header}>
        <div>
          <i
            className="fa fa-arrow-left"
            aria-hidden="true"
            onClick={onClick}
          ></i>
          <div>{header}</div>
        </div>
      </div>
    </div>
  );
}
export default PageHeader;

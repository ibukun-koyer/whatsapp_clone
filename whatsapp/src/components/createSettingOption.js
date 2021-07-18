import classes from "./createSettingOption.module.css";
function CreateSettingOption({ title, children, onClick }) {
  return (
    <div className={classes.containOpt} onClick={onClick}>
      <div className={classes.iconContainer}>{children}</div>
      <div className={classes.title}>{title}</div>
    </div>
  );
}
export default CreateSettingOption;

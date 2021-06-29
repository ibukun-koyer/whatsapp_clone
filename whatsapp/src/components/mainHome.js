import home from "./mainHome.module.css";

function MainHome({ children, onClick }) {
  return (
    <div className={home.sec} onClick={onClick}>
      {children}
    </div>
  );
}
export default MainHome;

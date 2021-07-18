import SignUp from "./components/signup";
import Login from "./components/login";
import PasswordRecovery from "./components/passwordRecovery";
import Home from "./components/Home";
import { FullScreenProvider } from "./context/requestFullScreen";
import { Route, Switch } from "react-router-dom";
import { OptionsProvider } from "./context/showOptions";
import { useAuth } from "./context/authContext";
import { useLayoutEffect } from "react";
import "./App.css";

function App() {
  const authentication = useAuth();
  useLayoutEffect(() => {
    let theme = localStorage.getItem("theme");
    if (theme && theme !== authentication.theme) {
      authentication.setTheme(theme);
    }
  }, []);

  return (
    <div className={authentication.theme === "dark" ? "dark" : ""}>
      <Switch>
        {/* match path home */}
        <Route path="/" exact>
          {/* option provider is a context that allows you show option section on pages, for example the reply and delete drop dow */}
          <OptionsProvider>
            {/* this provider allows you show pages that contain the whole screen, for example, addnewcontact, show image in fullscreen */}
            <FullScreenProvider>
              {/* renders home screen */}
              <Home />
            </FullScreenProvider>
          </OptionsProvider>
        </Route>
        {/* recover password route */}
        <Route path="/passwordRecovery" exact>
          <PasswordRecovery />
        </Route>
        {/* login route */}
        <Route path="/login" exact>
          <Login />
        </Route>
        {/* signup route */}
        <Route path="/signup" exact>
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

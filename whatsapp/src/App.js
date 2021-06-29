import SignUp from "./components/signup";
import Login from "./components/login";
import PasswordRecovery from "./components/passwordRecovery";
import Home from "./components/Home";
import { FullScreenProvider } from "./context/requestFullScreen";
import { Route, Switch } from "react-router-dom";
import { OptionsProvider } from "./context/showOptions";
function App() {
  return (
    <div>
      <Switch>
        <Route path="/" exact>
          <OptionsProvider>
            <FullScreenProvider>
              <Home />
            </FullScreenProvider>
          </OptionsProvider>
        </Route>
        <Route path="/passwordRecovery" exact>
          <PasswordRecovery />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

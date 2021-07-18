import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import firebase from "firebase";
import { replaceInvalid } from "../components/helperFiles/replaceEmailInvalid";
import { User } from "../components/helperFiles/userSchema";
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState({ username: "", url: "" });
  const [currentUser, setCurrentUser] = useState();

  function setInfo(info) {
    return setUserInfo(info);
  }
  async function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }
  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user
          .updateProfile({
            displayName: userInfo.username,
            photoURL: userInfo.url,
          })
          .then(() => {
            const ref = firebase
              .database()
              .ref(`users/${replaceInvalid(user.email)}`);
            ref.once("value", (snapshot) => {
              const obj = snapshot.val();
              if (!obj) {
                const userRef = firebase.database().ref("/users");
                const hashString = replaceInvalid(user.email);
                const newUser = new User(
                  user.uid,
                  user.displayName,
                  user.photoURL
                );

                userRef.child(hashString).set(newUser.data);
              }
              firebase
                .database()
                .ref(`users/${replaceInvalid(user.email)}/online`)
                .set(true);
            });
          });
        //check if user exist
      }
      setCurrentUser(user);
    });
    return unsubscribe;
  }, [userInfo.url, userInfo.username]);
  const value = {
    theme,
    setTheme,
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    setInfo,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

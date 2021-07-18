
let firebase = require("firebase/app");
require("firebase/auth");


const url =
  "https://th.bing.com/th/id/OIP.Psj56s3oU0aQkeZNr_rqpAEsEs?pid=ImgDet&rs=1";
const password = "#INsaneWoman StoleFR4m me";
const app = firebase.initializeApp({
  apiKey: "AIzaSyB2OihGeScALzK2EDjy3aipuvo9oicUX4c",
  authDomain: "whatsapp-b8ba4.firebaseapp.com",
  projectId: "whatsapp-b8ba4",
  storageBucket: "whatsapp-b8ba4.appspot.com",
  messagingSenderId: "948151516883",
  appId: "1:948151516883:web:3e04ae3a1ca273ca06de26",
  measurementId: "G-XT136L2BER",
});
const auth = app.auth();
firebase = require("firebase");
function replaceInvalid(str) {
  let newStr = str.toString();
  console.log(typeof str);
  newStr = newStr.replace(/[.#$\[\]]/g, "G-XT136L2BER");
  return newStr;
}

function fill() {
  //password anc confirmPassword √
  //email address
  //name √

  //create random name
  function randomName(length = Math.floor(Math.random() * 19) + 1) {
    let str = "";
    for (let i = 0; i < length; i++) {
      str += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return str;
  }

  //email ending pool
  const pool = [
    "@umbc.edu",
    "@gmail.com",
    "@yahoo.com",
    "@ccbcmd.edu",
    "@hotmail.com",
  ];

  function createUser(email, password) {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log("successful");
      })
      .catch((e) => {
        console.log("failed", e);
      });
  }
  const users = 2;
  function createEmail() {
    let str = randomName();
    return (str += pool[Math.floor(Math.random() * pool.length)]);
  }
  for (let i = 0; i < users; i++) {
    createUser(createEmail(), password);
  }
  auth.onAuthStateChanged((user) => {
    if (user) {
      user
        .updateProfile({
          displayName: randomName(),
          photoURL: url,
        })
        .then(() => {
          const userRef = app.database().ref("/users");
          const hashString = replaceInvalid(user.email);
          console.log(user.uid, user.photoURL, user.displayName);
          const newUser = {
            uid: user.uid,
            username: user.displayName,
            url: user.photoURL,
            status_pics_list: {},
            contact: {},
            archieved: {},
            status: "Hey there! I am using WhatsApp.",
            online: true,
            settings: { backgroundColor: "beige" },
          };
          userRef.child(hashString).set(newUser);
        });

    }
  });
}
fill();

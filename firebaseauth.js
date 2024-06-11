// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeOb938LNrMYbsD5MEZlw-WQgvxzD85dg",
  authDomain: "login-for-sustain.firebaseapp.com",
  databaseURL: "https://login-for-sustain-default-rtdb.firebaseio.com",
  projectId: "login-for-sustain",
  storageBucket: "login-for-sustain.appspot.com",
  messagingSenderId: "110394709519",
  appId: "1:110394709519:web:1becc6c3c224b327edf57a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}


const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  // Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password.match(passwordRegex)) {
    showMessage('Password must be at least 8 characters long and contain at least one alphabet and one digit', 'signUpMessage');
    return;
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'signUpMessage');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      return setDoc(docRef, userData);
    })
    .then(() => {
      window.location.href = 'Login.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else {
        showMessage('Unable to create User', 'signUpMessage');
      }
      console.error("Error during signup: ", error);
    });
});

// Sign in event listener
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('Login is successful', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'Profile.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage('Account does not exist', 'signInMessage');
      }
      console.error("Error during signin: ", error);
    });
});

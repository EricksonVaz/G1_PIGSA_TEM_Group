// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSb44sCqQnHnBFAaJTS7H8827fGWEAn0Q",
  authDomain: "csu-sms-server-v1.firebaseapp.com",
  projectId: "csu-sms-server-v1",
  storageBucket: "csu-sms-server-v1.appspot.com",
  messagingSenderId: "394390144186",
  appId: "1:394390144186:web:7dbd5de55dbc9874a52e83",
  measurementId: "G-Q3E7XQSPE6"
};

// Initialize Firebase
export const appFirebase = initializeApp(firebaseConfig);
export const analyticsFirebase = getAnalytics(appFirebase);
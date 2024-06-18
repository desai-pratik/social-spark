import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDefV1ZOPuoEcddnhDCTviyEoFY0sAuYEw",
    authDomain: "socialspark-48e74.firebaseapp.com",
    projectId: "socialspark-48e74",
    storageBucket: "socialspark-48e74.appspot.com",
    messagingSenderId: "320923162842",
    appId: "1:320923162842:web:b2567d507691251dbe6de3",
    measurementId: "G-LW2VLQ7CLB"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, signInWithPopup };
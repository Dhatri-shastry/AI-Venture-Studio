import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3qZ2YYRWr8i_6sGZDmUZf-Le3BSRCddY",
  authDomain: "ai-venture-studio-b526e.firebaseapp.com",
  projectId: "ai-venture-studio-b526e",
  storageBucket: "ai-venture-studio-b526e.firebasestorage.app",
  messagingSenderId: "1095193754929",
  appId: "1:1095193754929:web:0ee19faa244c56708d8410",
  measurementId: "G-8KCN4WYPR0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const githubProvider =
  new GithubAuthProvider();
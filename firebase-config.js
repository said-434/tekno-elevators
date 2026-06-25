import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCAXP76wfPcBN7pmofNFOWVIKFbWdKOxfg",
  authDomain: "tekno-elevators-b9788.firebaseapp.com",
  databaseURL: "https://tekno-elevators-b9788-default-rtdb.firebaseio.com",
  projectId: "tekno-elevators-b9788",
  storageBucket: "tekno-elevators-b9788.firebasestorage.app",
  messagingSenderId: "1043657107222",
  appId: "1:1043657107222:web:a9f319890f9eb399f15237"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
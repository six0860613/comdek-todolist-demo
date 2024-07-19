import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
	apiKey: "AIzaSyB5QgyAcXQUFvjfZ0sczlT12dBlCb6TLWY",
	authDomain: "comdek-todolist-demo.firebaseapp.com",
	projectId: "comdek-todolist-demo",
	storageBucket: "comdek-todolist-demo.appspot.com",
	messagingSenderId: "446263739808",
	appId: "1:446263739808:web:88f31ab39c0b8d582210c5",
	measurementId: "G-73L7009DPP",
};
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

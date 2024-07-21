import React, { useState, useEffect } from "react";
import { auth } from "./lib/db";
import { User } from "firebase/auth";
import ToDoList from "./pages/ToDoList";
import Login from "./pages/Login";

function App() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(setUser);
		return unsubscribe;
	}, []);

	return (
		<div className="h-[100dvh] w-full flex justify-center p-6 bg-stone-300">
			{user ? <ToDoList userId={user.uid} /> : <Login />}
		</div>
	);
}

export default App;

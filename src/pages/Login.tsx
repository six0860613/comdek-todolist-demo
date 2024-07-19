import React, { useState } from "react";
import { auth } from "../lib/db";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isLogin) {
				await signInWithEmailAndPassword(auth, email, password);
			} else {
				await createUserWithEmailAndPassword(auth, email, password);
			}
		} catch (error) {
			console.error("Authentication error:", error);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold mb-4">
				{isLogin ? "Login" : "Register"}
			</h2>
			<form onSubmit={handleAuth} className="space-y-4">
				<Input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<Button type="submit" className="w-full">
					{isLogin ? "Login" : "Register"}
				</Button>
			</form>
			<Button
				variant="link"
				onClick={() => setIsLogin(!isLogin)}
				className="mt-4"
			>
				{isLogin ? "Need to register?" : "Already have an account?"}
			</Button>
		</div>
	);
};

export default Login;

import React, { useState } from "react";
import { auth } from "../lib/db";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const handleAuth = async (e: React.FormEvent) => {
		setIsLoading(true);
		e.preventDefault();
		try {
			if (isLogin) {
				await signInWithEmailAndPassword(auth, email, password);
			} else {
				await createUserWithEmailAndPassword(auth, email, password);
			}
		} catch (error) {
			console.error("Authentication error:", JSON.parse(JSON.stringify(error)));
			if (error instanceof Error) {
				if (error.message.includes("email-already-in-use")) {
					setErrorMsg("Email already in use, please try another one.");
				} else if (error.message.includes("weak-password")) {
					setErrorMsg("Password should be at least 6 characters long.");
				} else if (error.message.includes("invalid-credential")) {
					setErrorMsg("Account or password is incorrect, please try again.");
				} else {
					setErrorMsg(error.message);
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const registerTrigger = () => {
		setIsLogin(!isLogin);
		setErrorMsg("");
		setEmail("");
		setPassword("");
	};

	return (
		<div className="max-w-lg w-[90%] md:w-2/3 h-[90%] md:h-1/2 p-6 bg-white rounded-lg shadow-lg flex flex-col ">
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
					{isLoading ? (
						<LoadingSpinner className="w-6 h-6" />
					) : isLogin ? (
						"Login"
					) : (
						"Register"
					)}
				</Button>
				{errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
			</form>
			<Button variant="link" onClick={registerTrigger} className="mt-4">
				{isLogin ? "Need to register?" : "Already have an account?"}
			</Button>
		</div>
	);
};

export default Login;

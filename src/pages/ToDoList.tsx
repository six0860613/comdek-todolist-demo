import React, { useState, useEffect } from "react";
import { Plus, Trash, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { db, auth } from "../lib/db";
import {
	collection,
	addDoc,
	query,
	where,
	onSnapshot,
	doc,
	updateDoc,
	deleteDoc,
	Timestamp,
} from "firebase/firestore";

export type Todo = {
	id: string;
	task: string;
	priority: string;
	deadline: Date;
	isDone: boolean;
};

type Props = {
	userId: string;
};

const TodoList: React.FC<Props> = ({ userId }) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [task, setTask] = useState<string>("");
	const [priority, setPriority] = useState<string>("medium");
	const [deadline, setDeadline] = useState<Date>(new Date());

	useEffect(() => {
		const q = query(collection(db, "todos"), where("userId", "==", userId));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const todosArr: Todo[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				todosArr.push({
					...data,
					id: doc.id,
					deadline: data.deadline.toDate(),
				} as Todo);
			});
			setTodos(todosArr);
		});

		return () => unsubscribe();
	}, []);

	const addTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (task) {
			await addDoc(collection(db, "todos"), {
				task,
				priority,
				deadline: Timestamp.fromDate(deadline),
				isDone: false,
				userId,
			});
			setTask("");
			setPriority("medium");
			setDeadline(new Date());
		}
	};

	const toggleTodo = async (todo: Todo) => {
		await updateDoc(doc(db, "todos", todo.id), {
			isDone: !todo.isDone,
		});
	};

	const updateTodo = async (id: string, data: Partial<Todo>) => {
		await updateDoc(doc(db, "todos", id), data);
	};

	const deleteTodo = async (id: string) => {
		await deleteDoc(doc(db, "todos", id));
	};

	const handleLogout = () => {
		auth.signOut();
	};

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
			<Button type="button" className="col-span-4" onClick={handleLogout}>
				Logout
			</Button>
			<h1 className="text-2xl font-bold mb-4">Todo List</h1>
			<form onSubmit={addTodo} className="mb-4 grid grid-cols-4 gap-4">
				<Input
					type="text"
					value={task}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setTask(e.target.value)
					}
					placeholder="Add a new task"
					className="col-span-2"
				/>
				<Select value={priority} onValueChange={setPriority}>
					<SelectTrigger>
						<SelectValue placeholder="Priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="low">Low</SelectItem>
						<SelectItem value="medium">Medium</SelectItem>
						<SelectItem value="high">High</SelectItem>
					</SelectContent>
				</Select>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{format(deadline, "PPP")}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={deadline}
							onSelect={(date) => date && setDeadline(date)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
				<Button type="submit" className="col-span-4">
					<Plus className="mr-2 h-4 w-4" /> Add Todo
				</Button>
			</form>
			<ul className="space-y-2">
				{todos.map((todo) => (
					<li
						key={todo.id}
						className="flex items-center space-x-2 bg-gray-50 p-2 rounded"
					>
						<Checkbox
							checked={todo.isDone}
							onCheckedChange={() => toggleTodo(todo)}
						/>
						<span
							className={`flex-grow ${
								todo.isDone ? "line-through text-gray-500" : ""
							}`}
						>
							{todo.task}
						</span>
						<Select
							value={todo.priority}
							onValueChange={(value) =>
								updateTodo(todo.id, { priority: value })
							}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue placeholder="Priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectContent>
						</Select>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline">
									<CalendarIcon className="mr-2 h-4 w-4" />
									{format(todo.deadline, "PPP")}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={todo.deadline}
									onSelect={(date) =>
										date && updateTodo(todo.id, { deadline: date })
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<Button
							variant="destructive"
							size="icon"
							onClick={() => deleteTodo(todo.id)}
						>
							<Trash className="h-4 w-4" />
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TodoList;

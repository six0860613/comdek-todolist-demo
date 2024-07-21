import dayjs from "dayjs";
import {
	addDoc,
	collection,
	onSnapshot,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/db";

import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import SearchHeader from "../components/SearchHeader";
import ListItem from "../components/ListItem";
import PaginationGroup from "../components/PaginationGroup";
import PrioritySelect from "../components/PrioritySelect";
import { Datepicker } from "../components/ui/datepicker";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";

export type Todo = {
	id: string;
	task: string;
	priority: string;
	deadline: Date;
	isDone: boolean;
	createdAt: Date;
};

type Props = {
	userId: string;
};
type SortKey = "task" | "priority" | "deadline" | "isDone" | "createdAt";

const TodoList: React.FC<Props> = ({ userId }) => {
	const [task, setTask] = useState<string>("");
	const [priority, setPriority] = useState<string>("select");
	const [deadline, setDeadline] = useState<Date | undefined>(undefined);

	const [todos, setTodos] = useState<Todo[]>([]);
	const [search, setSearch] = useState<Partial<Todo> | null>(null);
	const [sortKey, setSortKey] = useState<SortKey>("createdAt");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);

	useEffect(() => {
		const q = query(collection(db, "todos"), where("userId", "==", userId));
		const unsubscribe = onSnapshot(q, (res) => {
			const todosArr: Todo[] = [];
			res.forEach((v) => {
				const data = v.data();
				todosArr.push({
					...data,
					id: v.id,
					deadline: data.deadline.toDate(),
				} as Todo);
			});
			setTodos(todosArr);
		});

		return () => unsubscribe();
	}, [userId]);

	const handleLogout = () => {
		auth.signOut();
	};

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	const addTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (task) {
			await addDoc(collection(db, "todos"), {
				task,
				priority,
				deadline: deadline && Timestamp.fromDate(deadline),
				isDone: false,
				userId,
				createdAt: Timestamp.now(),
			});
			setTask("");
			setPriority("select");
			setDeadline(undefined);
		}
	};

	const sortedTodos = [...todos]
		.filter((el) => {
			if (search) {
				const searchTask = !search.task || el.task.includes(search.task);
				const searchPriority =
					!search.priority ||
					search.priority === "select" ||
					el.priority === search.priority;
				const searchDate =
					!search.deadline ||
					dayjs(el.deadline).format("YYYY-MM-DD") ===
						dayjs(search.deadline).format("YYYY-MM-DD");

				if (searchTask && searchPriority && searchDate) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		})
		.sort((a, b) => {
			if (sortKey === "deadline") {
				return sortDirection === "asc"
					? a.deadline.getTime() - b.deadline.getTime()
					: b.deadline.getTime() - a.deadline.getTime();
			}
			if (a[sortKey] < b[sortKey]) return sortDirection === "asc" ? -1 : 1;
			if (a[sortKey] > b[sortKey]) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	const paginatedTodos = sortedTodos.slice(
		(currentPage - 1) * limit,
		currentPage * limit
	);
	const totalPages = Math.ceil(sortedTodos.length / limit);

	return (
		<div className="max-w-[90dvw] md:max-w-4xl flex flex-col h-full gap-4">
			<div className="w-full h-12 md:h-20 p-6 bg-white rounded-lg shadow-lg flex justify-between items-center">
				<h1 className="text-xl md:text-2xl font-bold">Todo List</h1>
				<Button type="button" className="col-span-4" onClick={handleLogout}>
					Logout
				</Button>
			</div>
			<div className="w-full flex-1 p-6 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
				<SearchHeader todos={sortedTodos} setSearch={setSearch} />
				<div className="flex-1 overflow-auto relative">
					<Table>
						<TableHeader className="sticky top-0 z-10">
							<TableRow className="text-white font-bold border-none bg-slate-400">
								<TableHead className="w-[50px]">Done</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-slate-300"
									onClick={() => handleSort("task")}
								>
									Task
									{sortKey === "task" &&
										(sortDirection === "desc" ? (
											<FaArrowUp className="ml-2 h-4 w-4 inline" />
										) : (
											<FaArrowDown className="ml-2 h-4 w-4 inline" />
										))}
								</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-slate-300"
									onClick={() => handleSort("priority")}
								>
									Priority
									{sortKey === "priority" &&
										(sortDirection === "desc" ? (
											<FaArrowUp className="ml-2 h-4 w-4 inline" />
										) : (
											<FaArrowDown className="ml-2 h-4 w-4 inline" />
										))}
								</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-slate-300"
									onClick={() => handleSort("deadline")}
								>
									Deadline
									{sortKey === "deadline" &&
										(sortDirection === "desc" ? (
											<FaArrowUp className="ml-2 h-4 w-4 inline" />
										) : (
											<FaArrowDown className="ml-2 h-4 w-4 inline" />
										))}
								</TableHead>
								<TableHead className="w-[100px]">Actions</TableHead>
							</TableRow>
							<TableRow className="border-none bg-secondary h-20">
								<TableHead></TableHead>
								<TableHead>
									<Input
										type="text"
										value={task}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setTask(e.target.value)
										}
										placeholder="Type a task name..."
										className="w-[10rem] md:w-[20rem]"
									/>
								</TableHead>
								<TableHead>
									<PrioritySelect
										priority={priority}
										setPriority={setPriority}
									/>
								</TableHead>
								<TableHead>
									<Datepicker date={deadline} setDate={setDeadline} />
								</TableHead>
								<TableHead>
									<Button
										type="button"
										variant="default"
										size="sm"
										onClick={addTodo}
									>
										<IoMdAdd className="h-4 w-4 text-white" />
									</Button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedTodos.map((todo) => (
								<ListItem key={todo.id} todo={todo} />
							))}
						</TableBody>
					</Table>
				</div>
				<PaginationGroup
					totalPages={totalPages}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					limit={limit}
					setLimit={setLimit}
				/>
			</div>
		</div>
	);
};

export default TodoList;

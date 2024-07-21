import React, { Dispatch, SetStateAction, useState } from "react";
import { Todo } from "../pages/ToDoList";
import { genXlsx } from "../lib/genXlsx";

import { FaSearch, FaFileExport } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

import PrioritySelect from "./PrioritySelect";
import { Datepicker } from "./ui/datepicker";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import dayjs from "dayjs";

type Props = {
	todos: Todo[];
	setSearch: Dispatch<SetStateAction<Partial<Todo> | null>>;
};

const SearchHeader: React.FC<Props> = ({ todos, setSearch }) => {
	const [task, setTask] = useState<string>("");
	const [priority, setPriority] = useState<string>("select");
	const [deadline, setDeadline] = useState<Date | undefined>(undefined);

	const searchTodo = () => {
		setSearch({ task, priority, deadline });
	};

	const resetSearch = () => {
		setTask("");
		setPriority("select");
		setDeadline(undefined);
		setSearch(null);
	};

	const exportTodo = async () => {
		const headers = [
			{ key: "task", name: "Task" },
			{ key: "priority", name: "Priority" },
			{ key: "deadline", name: "Deadline" },
			{ key: "isDone", name: "isDone" },
		];
		const entries = todos.map((todo) => {
			const transPriority = (priority: string) => {
				switch (priority) {
					case "1":
						return "Hight";
					case "2":
						return "Medium";
					case "3":
						return "Low";
					default:
						return "";
				}
			};
			return {
				task: todo.task,
				priority: transPriority(todo.priority),
				deadline: dayjs(todo.deadline).format("YYYY-MM-DD"),
				isDone: todo.isDone ? "1" : "0",
			};
		});
		const res = await genXlsx(headers, entries);
		const blob = new Blob([res]);
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "ToDoList.csv";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<div className="mb-6 flex gap-4 flex-wrap items-end">
			<div className="grid items-center gap-1.5">
				<Label htmlFor="task">Task</Label>
				<Input
					type="text"
					id="task"
					value={task}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setTask(e.target.value)
					}
					placeholder="Search by task name..."
					className="w-[20rem]"
				/>
			</div>
			<div className="grid items-center gap-1.5">
				<Label htmlFor="priority">Priority</Label>
				<PrioritySelect priority={priority} setPriority={setPriority} />
			</div>
			<div className="grid items-center gap-1.5">
				<Label htmlFor="deadline">Deadline</Label>
				<Datepicker date={deadline} setDate={setDeadline} />
			</div>
			<TooltipProvider delayDuration={300}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="button" onClick={resetSearch}>
							<GrPowerReset className="h-4 w-4 text-white" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Reset</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="button" onClick={searchTodo}>
							<FaSearch className="h-4 w-4 text-white" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Search</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="button" onClick={exportTodo}>
							<FaFileExport className="h-4 w-4 text-white" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Export CSV</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default SearchHeader;

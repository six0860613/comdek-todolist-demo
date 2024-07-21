import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Datepicker } from "./ui/datepicker";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { TableCell, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { db } from "../lib/db";
import { Todo } from "../pages/ToDoList";
import PrioritySelect from "./PrioritySelect";
import dayjs from "dayjs";

type Props = {
	todo: Todo;
};

const ListItem: React.FC<Props> = ({ todo }) => {
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

	return (
		<TableRow>
			<TableCell>
				<Checkbox
					checked={todo.isDone}
					onCheckedChange={() => toggleTodo(todo)}
				/>
			</TableCell>
			<TableCell className={todo.isDone ? "line-through text-gray-500" : ""}>
				<Input
					type="text"
					value={todo.task}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						updateTodo(todo.id, { task: e.target.value })
					}
					placeholder="Type a task name..."
					className="w-[10rem] md:w-[20rem]"
					disabled={todo.isDone}
				/>
			</TableCell>
			<TableCell>
				<PrioritySelect
					priority={todo.priority}
					setPriority={(value) => updateTodo(todo.id, { priority: value })}
					disabled={todo.isDone}
				/>
			</TableCell>
			<TableCell>
				<Datepicker
					date={todo.deadline}
					setDate={(date) =>
						updateTodo(todo.id, {
							deadline: dayjs(date).startOf("day").toDate(),
						})
					}
					disabled={todo.isDone}
				/>
			</TableCell>
			<TableCell>
				<Button
					variant="destructive"
					size="sm"
					onClick={() => deleteTodo(todo.id)}
					disabled={todo.isDone}
				>
					<FaTrashAlt className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	);
};

export default ListItem;

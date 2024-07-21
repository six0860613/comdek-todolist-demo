import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

type Props = {
	priority: string;
	setPriority: (value: string) => void;
	disabled?: boolean;
};

const selectOptions = [
	{ label: "Select..", value: "select" },
	{ label: "Low", value: "3" },
	{ label: "Medium", value: "2" },
	{ label: "High", value: "1" },
];

const PrioritySelect: React.FC<Props> = ({
	priority,
	setPriority,
	disabled,
}) => {
	return (
		<Select value={priority} onValueChange={setPriority} disabled={disabled}>
			<SelectTrigger className="w-32">
				<SelectValue placeholder="Priority" />
			</SelectTrigger>
			<SelectContent className="w-32">
				{selectOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default PrioritySelect;

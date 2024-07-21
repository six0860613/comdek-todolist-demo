import { format } from "date-fns";
import React, { useState } from "react";
import { RxCalendar } from "react-icons/rx";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Props = {
	date: Date | undefined;
	setDate: (date: Date) => void;
	disabled?: boolean;
};

const Datepicker: React.FC<Props> = ({ date, setDate, disabled }) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	return (
		<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="default"
					className="w-[10rem]"
					disabled={disabled}
				>
					<RxCalendar className="mr-2 h-4 w-4" />
					{date ? format(date, "yyyy-MM-dd") : "Select date.."}
				</Button>
			</PopoverTrigger>
			{disabled ? null : (
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={(v) => {
							if (v) {
								setDate(v);
								setIsCalendarOpen(false);
							}
						}}
						initialFocus
					/>
				</PopoverContent>
			)}
		</Popover>
	);
};

Datepicker.displayName = "Datepicker";
export { Datepicker };

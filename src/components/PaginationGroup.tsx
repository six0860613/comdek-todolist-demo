import React, { Dispatch, SetStateAction } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../components/ui/pagination";

type Props = {
	totalPages: number;
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	limit: number;
	setLimit: Dispatch<SetStateAction<number>>;
};

const selectOptions = [
	{ label: "5 per page", value: "5" },
	{ label: "10 per page", value: "10" },
	{ label: "25 per page", value: "25" },
	{ label: "100 per page", value: "100" },
];

const PaginationGroup: React.FC<Props> = ({
	totalPages,
	currentPage,
	setCurrentPage,
	limit,
	setLimit,
}) => {
	return (
		<div className="flex items-center py-2">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							className={
								currentPage === 1
									? "pointer-events-none opacity-50"
									: "cursor-pointer"
							}
						/>
					</PaginationItem>
					{[...Array(totalPages)].map((_, i) => (
						<PaginationItem key={i}>
							<PaginationLink
								onClick={() => setCurrentPage(i + 1)}
								isActive={currentPage === i + 1}
								className="cursor-pointer"
							>
								{i + 1}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							className={
								currentPage === totalPages
									? "pointer-events-none opacity-50"
									: "cursor-pointer"
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<Select
				value={limit.toString()}
				onValueChange={(value: string) => setLimit(Number(value))}
			>
				<SelectTrigger className="md:w-[180px]">
					<SelectValue placeholder="Select limit" />
				</SelectTrigger>
				<SelectContent>
					{selectOptions.map((el, i) => (
						<SelectItem key={i} value={el.value}>
							{el.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default PaginationGroup;

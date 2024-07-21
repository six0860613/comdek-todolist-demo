import * as XLSX from "xlsx-js-style";

export const genXlsx = async (
	headers: { key: string; name: string }[],
	entries: any[]
) => {
	const ws_data = [
		[...headers.map((header) => header.name)],
		...entries.map((entry) => headers.map((header) => entry[header.key])),
	];
	const ws = XLSX.utils.aoa_to_sheet(ws_data);

	const maxWidths = headers.map((header, i) =>
		ws_data.reduce(
			(max, row) => Math.max(max, row[i] ? row[i].toString().length : 0),
			header.name.length
		)
	);
	ws["!cols"] = maxWidths.map((width) => ({ wch: width + 2 }));

	for (let i = 0; i < headers.length; i++) {
		const col = String.fromCharCode(i + 65);
		ws[`${col}1`].s = { font: { bold: true } };
	}

	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

	const file = XLSX.write(wb, { bookType: "csv", type: "buffer" });

	return file;
};

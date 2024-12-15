// src/components/ui/table.jsx

import React from "react";

export const Table = ({ children, className = "" }) => (
	<div className={`w-full border rounded ${className}`}>
		<table className="w-full">{children}</table>
	</div>
);

export const TableHeader = ({ children }) => (
	<thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
);

/*************  ✨ Codeium Command ⭐  *************/
// Renders a table header cell (<th>) with customizable styles.
/******  55e825c5-ca56-4da1-bd84-a5453035c157  *******/ export const TableBody =
	({ children }) => <tbody>{children}</tbody>;
// - className: Additional CSS classes for custom styling.

export const TableHead = ({ children, className = "" }) => (
	<th
		className={`p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${className}`}
	>
		{children}
	</th>
);

export const TableRow = ({ children, className = "" }) => (
	<tr
		className={`border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}
	>
		{children}
	</tr>
);

export const TableCell = ({ children, className = "" }) => (
	<td className={`p-3 text-sm text-gray-900 dark:text-gray-100 ${className}`}>
		{children}
	</td>
);

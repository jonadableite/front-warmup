import PropTypes from "prop-types";
// src/components/ui/badge.jsx
import * as React from "react";

export function Badge({ variant = "default", children }) {
	const variantClasses = {
		default: "bg-gray-200 text-gray-800",
		success: "bg-green-200 text-green-800",
		destructive: "bg-red-200 text-red-800",
	};

	return (
		<span
			className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
		>
			{children}
		</span>
	);
}

Badge.propTypes = {
	variant: PropTypes.oneOf(["default", "success", "destructive"]),
	children: PropTypes.node.isRequired,
};

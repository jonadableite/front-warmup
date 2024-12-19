import type React from "react";

interface SidebarGroupProps {
	children: React.ReactNode;
	className?: string;
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ children, className }) => {
	return <div className={`px-2 ${className || ""}`}>{children}</div>;
};

export default SidebarGroup;

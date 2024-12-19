import type React from "react";

interface SidebarContentProps {
	children: React.ReactNode;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ children }) => {
	return <div className="overflow-y-auto py-4">{children}</div>;
};

export default SidebarContent;

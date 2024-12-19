import type React from "react";

interface SidebarMenuItemProps {
	children: React.ReactNode;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ children }) => {
	return <li>{children}</li>;
};

export default SidebarMenuItem;

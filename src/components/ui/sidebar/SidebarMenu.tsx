import type React from "react";

interface SidebarMenuProps {
	children: React.ReactNode;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ children }) => {
	return <ul className="space-y-1">{children}</ul>;
};

export default SidebarMenu;

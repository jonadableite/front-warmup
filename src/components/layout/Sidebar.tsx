import SidebarComponent from "@/components/SidebarComponent";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import type React from "react";

const LayoutSidebar: React.FC = ({ children }) => {
	return (
		<div className="flex">
			<DropdownMenu>
				<SidebarComponent />
			</DropdownMenu>
			<main className="flex-1 transition-all duration-300">{children}</main>
		</div>
	);
};

export default LayoutSidebar;

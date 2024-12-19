import SidebarComponent from "@/components/SidebarComponent";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import type React from "react";

const LayoutSidebar: React.FC = ({ children }) => {
	const { open } = useSidebar();

	return (
		<SidebarProvider>
			<div className="flex">
				<DropdownMenu>
					<SidebarComponent />
				</DropdownMenu>
				<main
					className={`flex-1 transition-all duration-300 ${
						open ? "ml-60" : "ml-20"
					}`}
				>
					{children}
				</main>
			</div>
		</SidebarProvider>
	);
};

export default LayoutSidebar;

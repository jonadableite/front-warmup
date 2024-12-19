import type React from "react";
import { useSidebar } from "./SidebarProvider";

interface SidebarProps {
	children: React.ReactNode;
	side?: "left" | "right";
	variant?: "sidebar" | "floating" | "inset";
	collapsible?: "offcanvas" | "icon" | "none";
	style?: React.CSSProperties;
}

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

const Sidebar: React.FC<SidebarProps> = ({
	children,
	side = "left",
	variant = "sidebar",
	collapsible = "offcanvas",
	style,
}) => {
	const { open } = useSidebar();

	const baseStyles = {
		"--sidebar-width": SIDEBAR_WIDTH,
		"--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
	};

	const mergedStyles = { ...baseStyles, ...style };

	return (
		<aside
			style={mergedStyles}
			className={`
                fixed
                top-0
                h-full
                bg-sidebar-background
                text-sidebar-foreground
                border-r
                border-sidebar-border
                shadow-md
                transition-all
                duration-300
                z-20
                ${side === "left" ? "left-0" : "right-0"}
                ${
									variant === "sidebar"
										? `w-[var(--sidebar-width)]`
										: variant === "floating"
											? "w-[var(--sidebar-width)]"
											: "w-full"
								}
                ${
									collapsible === "offcanvas"
										? open
											? "translate-x-0"
											: side === "left"
												? "-translate-x-full"
												: "translate-x-full"
										: collapsible === "icon"
											? open
												? "w-[var(--sidebar-width)]"
												: "w-20"
											: ""
								}
                ${variant === "inset" ? "border-none shadow-none" : ""}
                dark:bg-gray-900 dark:border-gray-700
            `}
		>
			{children}
		</aside>
	);
};

export default Sidebar;

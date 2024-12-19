import type React from "react";

interface SidebarHeaderProps {
	children: React.ReactNode;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children }) => {
	return (
		<div
			className="
                sticky
                top-0
                p-4
                bg-sidebar-background
                border-b
                border-sidebar-border
                dark:bg-gray-900 dark:border-gray-700
            "
		>
			{children}
		</div>
	);
};

export default SidebarHeader;

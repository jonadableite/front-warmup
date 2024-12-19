import type React from "react";

interface SidebarFooterProps {
	children: React.ReactNode;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ children }) => {
	return (
		<div
			className="
                sticky
                bottom-0
                p-4
                bg-sidebar-background
                border-t
                border-sidebar-border
                dark:bg-gray-900 dark:border-gray-700
            "
		>
			{children}
		</div>
	);
};

export default SidebarFooter;

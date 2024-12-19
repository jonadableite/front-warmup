import type React from "react";

interface SidebarMenuButtonProps {
	children: React.ReactNode;
	asChild?: boolean;
	isActive?: boolean;
}

const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
	children,
	asChild = false,
	isActive = false,
}) => {
	const button = (
		<button
			className={`
                flex
                items-center
                w-full
                p-3
                rounded-md
                cursor-pointer
                hover:bg-gray-700/50
                transition-colors
                duration-200
                ${isActive ? "bg-gray-700/50" : ""}
            `}
		>
			{children}
		</button>
	);

	if (asChild) {
		return <>{children}</>;
	}

	return button;
};

export default SidebarMenuButton;

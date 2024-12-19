import type React from "react";

interface DropdownMenuItemProps {
	children: React.ReactNode;
	onClick?: () => void;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
	children,
	onClick,
}) => {
	return (
		<button
			onClick={onClick}
			className="
        flex
        items-center
        w-full
        px-4
        py-2
        text-left
        text-gray-700
        dark:text-gray-300
        hover:bg-gray-100
        dark:hover:bg-gray-700
        focus:outline-none
      "
		>
			{children}
		</button>
	);
};

export default DropdownMenuItem;

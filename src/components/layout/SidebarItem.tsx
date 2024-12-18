import { motion } from "framer-motion";
import type React from "react";

interface SidebarItemProps {
	icon: React.ElementType;
	label: string;
	isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
	icon: Icon,
	label,
	isOpen,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2 }}
			className={`
        flex items-center p-3 cursor-pointer group
        hover:bg-gray-700/50
        transition-colors duration-200
        ${isOpen ? "justify-start" : "justify-center"}
      `}
			title={!isOpen ? label : ""}
		>
			<Icon
				className={`
          ${isOpen ? "mr-3" : ""}
          text-gray-400 group-hover:text-white
        `}
				size={20}
			/>
			{isOpen && (
				<span className="text-sm text-gray-300 group-hover:text-white">
					{label}
				</span>
			)}
		</motion.div>
	);
};

export default SidebarItem;

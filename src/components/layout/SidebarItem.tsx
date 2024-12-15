import type React from "react";

// Definição das propriedades esperadas pelo componente SidebarItem
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
		<div
			className={`
        flex items-center p-3 cursor-pointer group
        hover:bg-whatsapp-green/20 dark:hover:bg-gray-700
        ${isOpen ? "justify-start" : "justify-center"}
      `}
			title={!isOpen ? label : ""}
		>
			<Icon
				className={`
          ${isOpen ? "mr-3" : ""}
          text-gray-500
        `}
				size={24}
			/>
			{isOpen && <span className="text-sm dark:text-white">{label}</span>}
		</div>
	);
};

export default SidebarItem;

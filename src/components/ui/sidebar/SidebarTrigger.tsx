import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import type React from "react";
import { useSidebar } from "./SidebarProvider";

interface SidebarTriggerProps {
	className?: string;
}

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className }) => {
	const { open, toggleSidebar } = useSidebar();

	return (
		<button
			type="button"
			onClick={toggleSidebar}
			className={`
                absolute
                top-4
                right-[-12px]
                bg-whatsapp-green
                text-white
                p-1
                rounded-full
                hover:bg-whatsapp-dark
                transition
                z-30
                ${className || ""}
            `}
		>
			{open ? <ChevronsLeftIcon size={20} /> : <ChevronsRightIcon size={20} />}
		</button>
	);
};

export default SidebarTrigger;

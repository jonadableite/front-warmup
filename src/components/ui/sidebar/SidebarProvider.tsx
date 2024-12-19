import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface SidebarContextProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
	undefined,
);

interface SidebarProviderProps {
	children: React.ReactNode;
	defaultOpen?: boolean;
}

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 31536000; // 1 year

const SidebarProvider: React.FC<SidebarProviderProps> = ({
	children,
	defaultOpen = false,
}) => {
	const [open, _setOpen] = useState(defaultOpen);

	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;
			_setOpen(openState);

			// This sets the cookie to keep the sidebar state.
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[open],
	);

	const toggleSidebar = useCallback(() => {
		setOpen((prevOpen) => !prevOpen);
	}, [setOpen]);

	useEffect(() => {
		const cookieValue = document.cookie
			.split("; ")
			.find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
			?.split("=")[1];

		if (cookieValue) {
			setOpen(cookieValue === "true");
		}
	}, [setOpen]);

	return (
		<SidebarContext.Provider
			value={{
				open,
				setOpen,
				toggleSidebar,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};

const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}
	return context;
};

export { SidebarProvider, useSidebar };

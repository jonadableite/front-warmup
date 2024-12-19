"use client";

import { cn } from "@/lib/utils";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import React from "react";

interface DropdownMenuContentProps
	extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
	className?: string;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> =
	React.forwardRef<
		React.ElementRef<typeof DropdownMenuPrimitive.Content>,
		DropdownMenuContentProps
	>(({ children, side = "top", align = "start", className, ...props }, ref) => {
		return (
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					ref={ref}
					sideOffset={4}
					className={cn(
						"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
						className,
					)}
					side={side}
					align={align}
					{...props}
				>
					{children}
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		);
	});

DropdownMenuContent.displayName = "DropdownMenuContent";

export default DropdownMenuContent;

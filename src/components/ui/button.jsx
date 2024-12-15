// src/components/ui/button.jsx
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import PropTypes from "prop-types";
// src/components/ui/button.jsx
import * as React from "react";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-whatsapp-green text-white shadow hover:bg-whatsapp-dark",
				outline: "border border-whatsapp-green text-whatsapp-green",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const Button = React.forwardRef(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

// Adicionando PropTypes para validação das props
Button.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.oneOf(["default", "outline"]),
	size: PropTypes.oneOf(["default", "sm"]),
	asChild: PropTypes.bool,
};

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };

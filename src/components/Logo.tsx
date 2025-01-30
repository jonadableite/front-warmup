/**
 * @copyright 2025 jonadab-whatlead
 * @license Apache-2.0
 */

/**
 * Assets
 */
import { favicon, logo } from "../assets/index";

type LogoProps = {
	variant?: "default" | "icon";
	className?: string;
};

const Logo = ({ variant = "default" }: LogoProps) => {
	return (
		<a href="" className="flex items-center gap-2">
			{variant === "default" && (
				<div className="flex items-center">
					<img
						src={favicon}
						alt="WhatLead icon"
						width={32}
						height={32}
						className="mr-2"
					/>
					<img src={logo} alt="WhatLead logo" width={200} height={91} />
				</div>
			)}

			{variant === "icon" && (
				<img src={favicon} alt="WhatLead logo" width={32} height={32} />
			)}
		</a>
	);
};

export default Logo;

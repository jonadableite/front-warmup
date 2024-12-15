import React from "react";

// Componente Card
export const Card = ({ children, className }) => (
	<div className={`card ${className}`}>{children}</div>
);

// Componente CardHeader
export const CardHeader = ({ children, className }) => (
	<div className={`card-header ${className}`}>{children}</div>
);

// Componente CardTitle
export const CardTitle = ({ children, className }) => (
	<h2 className={`card-title ${className}`}>{children}</h2>
);

// Componente CardDescription
export const CardDescription = ({ children, className }) => (
	<p className={`card-description ${className}`}>{children}</p>
);

// Componente CardContent
export const CardContent = ({ children, className }) => (
	<div className={`card-content ${className}`}>{children}</div>
);

// Componente CardFooter
export const CardFooter = ({ children, className }) => (
	<div className={`card-footer ${className}`}>{children}</div>
);

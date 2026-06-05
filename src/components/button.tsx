import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "lg";

interface ButtonProps {
  href?: string;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

/**
 * Button. Ported from 01-ui-components.jsx (`Button`) — same `.btn`/`.btn-*`
 * classes. Renders a Next <Link> when `href` is given, otherwise a <button>.
 */
export function Button({
  href,
  variant = "primary",
  size,
  block,
  className = "",
  children,
  type = "button",
  onClick,
  disabled,
  target,
  rel,
  ...aria
}: ButtonProps) {
  const cls = ["btn", `btn-${variant}`, size && `btn-${size}`, block && "btn-block", className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={cls} target={target} rel={rel} {...aria}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled} {...aria}>
      {children}
    </button>
  );
}

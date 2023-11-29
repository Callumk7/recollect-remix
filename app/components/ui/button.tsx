import clsx from "clsx";
import { Button as AriaButton, ButtonProps } from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { Link as RemixLink, NavLink as RemixNavLink } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/dist/components";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium ring-offset-mauve2 transition-colors focus:outline-cyan7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-mauve12 text-mauve1",
        secondary: "bg-ruby9 text-mauve1",
        link: "hover:bg-mauve4",
        ghost: "hover:bg-mauve4",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-2 py-1",
        icon: "w-8 h-8 p-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface FullButtonProps
  extends ButtonProps,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, FullButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <AriaButton
        className={clsx(buttonVariants({ className, variant, size }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

interface FullLinkProps
  extends RemixLinkProps,
    VariantProps<typeof buttonVariants> {}

const Link = forwardRef<HTMLAnchorElement, FullLinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <RemixLink
        className={clsx(buttonVariants({ className, variant, size }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Link.displayName = "Link";

const NavLink = forwardRef<HTMLAnchorElement, FullLinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <RemixNavLink
        className={clsx(buttonVariants({ className, variant, size }))}
        ref={ref}
        {...props}
      />
    );
  },
);
NavLink.displayName = "NavLink";

export { Button, Link, NavLink };

import clsx from "clsx";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx(className, "mx-auto w-4/5")}>{children}</div>;
}

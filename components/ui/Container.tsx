import clsx from "clsx";
import type { ComponentProps } from "react";

/** Full-width page rail: one left and one right edge for every block. */
export const RAIL = "w-full px-4 sm:px-8 lg:px-12";

export function Container({ className, ...rest }: ComponentProps<"div">) {
  return <div className={clsx(RAIL, className)} {...rest} />;
}

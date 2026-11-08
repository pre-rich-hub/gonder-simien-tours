import { createElement, type ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

const navigation = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = navigation;

/**
 * Locale-aware Link with viewport prefetching off by default. On Vercel every
 * prefetched link is an ISR read, and the header, mega menu and footer put
 * dozens of links on screen per page view. Pass `prefetch` to opt back in.
 */
export function Link({ prefetch = false, ...props }: ComponentProps<typeof navigation.Link>) {
  return createElement(navigation.Link, { prefetch, ...props });
}

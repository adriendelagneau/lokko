"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbSingleProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbSingle({ items }: BreadcrumbSingleProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-md">
        {items.map((item, index) => {

          return (
            <li key={index} className="flex items-center gap-1">
              {index !== 0 && (
                <ChevronRight className="h-4 w-4 opacity-60" />
              )}

              {item.href ? (
                <Link
                  href={item.href}
                  className={"transition hover:text-primary "}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

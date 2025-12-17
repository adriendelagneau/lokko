"use client";

import React, { useMemo, useRef, useState } from "react";

import { Category } from "@/actions/category-actions";

interface CategoriesProps {
  categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCategory = useMemo(
    () => categories.find((c) => c.name === hovered),
    [hovered, categories]
  );

  const handleEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(name);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
    }, 200);
  };

  return (
    <div className="bg-background relative mx-auto hidden max-w-5xl lg:block">
      {/* Top categories */}
      <ul
        className="relative z-10 flex items-center justify-center py-4"
        onMouseLeave={handleLeave}
      >
        {categories.map((cat) => (
          <li
            key={cat.id}
            onMouseEnter={() => handleEnter(cat.name)}
            className={`text-md cursor-pointer px-4 font-medium capitalize transition ${
              hovered === cat.name ? "text-primary" : "hover:text-primary"
            }`}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      <div className="bg-primary h-px w-full" />

      {/* Dropdown */}
      {activeCategory && (
        <div
          className="absolute top-14 z-0 mt-px flex h-96 w-full shadow-lg"
          onMouseEnter={() =>
            timeoutRef.current && clearTimeout(timeoutRef.current)
          }
          onMouseLeave={handleLeave}
        >
          {/* Left column */}
          <div className="bg-secondary w-56 p-4 font-medium capitalize">
            {activeCategory.name}
          </div>

          {/* Subcategories */}
          <div className="bg-background flex-1 p-6">
            {activeCategory.subcategories?.length ? (
              <ul className="grid grid-cols-3 gap-4">
                {activeCategory.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    className="hover:text-primary cursor-pointer text-sm transition"
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No subcategories</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

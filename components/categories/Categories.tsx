"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { Category } from "@/actions/category-actions";

interface CategoriesProps {
  categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCategory = useMemo(
    () => categories.find((c) => c.name === hovered),
    [hovered, categories],
  );

  const handleEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(name);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
    }, 300);
  };

  return (
    <div className="bg-background relative z-40 mx-auto hidden max-w-6xl lg:block">
      {/* Top categories */}
      <nav aria-label="Catégories principales">
        <ul
          className="relative z-50 flex items-center justify-between py-4"
          onMouseLeave={handleLeave}
          role="menubar"
        >
          {categories.map((cat) => (
            <li
              key={cat.id}
              onMouseEnter={() => handleEnter(cat.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEnter(cat.name);
                } else if (e.key === "Escape") {
                  setHovered(null);
                }
              }}
              tabIndex={0}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={hovered === cat.name}
              className={`text-md cursor-pointer px-4 font-medium capitalize transition outline-none focus-visible:text-primary ${
                hovered === cat.name ? "text-primary" : "hover:text-primary"
              }`}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-primary h-px w-full" />

      {/* Dropdown */}
      {activeCategory && (
        <div
          className="bg-background animate-in fade-in  duration-300 absolute top-full z-10 flex h-[430px] w-full border-b border-r shadow-2xl"
          onMouseEnter={() =>
            timeoutRef.current && clearTimeout(timeoutRef.current)
          }
          onMouseLeave={handleLeave}
          role="menu"
          aria-label={`Sous-catégories de ${activeCategory.name}`}
        >
          {/* Left column */}
          <div className="dark:bg-secondary-foreground bg-secondary flex w-56 flex-col justify-between p-4 font-medium capitalize">
            <span className="text-lg font-bold">{activeCategory.name}</span>

            {/* CATEGORY → SEARCH */}
            <Link
              href={`/search?category=${activeCategory.slug}`}
              className="hover:text-primary text-sm font-semibold underline-offset-2 hover:underline transition-colors"
            >
              Voir tout
            </Link>
          </div>

          {/* Subcategories + Products */}
          <div className="bg-background flex-1 overflow-y-auto p-6 border-l">
            {activeCategory.subcategories?.length ? (
              <ul className="grid grid-cols-3 gap-8">
                {activeCategory.subcategories.map((sub) => (
                  <li key={sub.id} role="none">
                    <p className="decoration-primary mb-3 font-semibold underline underline-offset-6 text-foreground">
                      {sub.name}
                    </p>

                    {/* PRODUCTS */}
                    <ul className="mb-4 space-y-2 text-sm" role="menu">
                      {sub.products?.length ? (
                        sub.products.map((product) => (
                          <li
                            key={product.id}
                            className="hover:text-primary cursor-pointer transition-colors"
                            role="menuitem"
                          >
                            <Link
                              href={`/search?category=${activeCategory.slug}&subCategory=${sub.slug}&product=${product.slug}`}
                              className="block py-0.5"
                            >
                              {product.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground italic py-1" role="none">
                          Aucun produit
                        </li>
                      )}
                    </ul>

                    {/* SUBCATEGORY → SEARCH */}
                    <Link
                      href={`/search?category=${activeCategory.slug}&subCategory=${sub.slug}`}
                      className="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-wider underline-offset-2 hover:underline transition-colors"
                    >
                      Explorer {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Aucune sous-catégorie disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

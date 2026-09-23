import React, { useEffect, useRef } from "react";
import type { Category, Product } from "../../interfaces/Product";
import { ProductCard } from "./ProductCard";

interface GroupedProductListProps {
  products: Product[];
  categories: Category[];
  isTakeaway: boolean;
  onActiveCategoryChange: (categoryId: number | null) => void;
}

export const GroupedProductList: React.FC<GroupedProductListProps> = ({
  products,
  categories,
  isTakeaway,
  onActiveCategoryChange,
}) => {
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const groupedByCategory = categories
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.categoryId === cat.id),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = Number(visible[0].target.getAttribute("data-category-id"));
          onActiveCategoryChange(id);
        }
      },
      {
        rootMargin: "-120px 0px -70% 0px",
        threshold: 0,
      },
    );

    sectionRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [groupedByCategory.length, onActiveCategoryChange]);

  return (
    <div>
      {groupedByCategory.map(({ category, items }) => (
        <div
          key={category.id}
          id={`category-section-${category.id}`}
          data-category-id={category.id}
          ref={(el) => {
            if (el) sectionRefs.current.set(category.id, el);
            else sectionRefs.current.delete(category.id);
          }}
          className="mb-4"
        >
          <h4 className="fw-bold custom-black-color mb-3 pb-2 border-bottom">
            {category.name}
          </h4>
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isTakeaway={isTakeaway}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

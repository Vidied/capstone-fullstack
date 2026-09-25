import { useEffect, useRef } from "react";
import { Nav } from "react-bootstrap";
import type { Category } from "../../interfaces/Product";

export type CategorySelection = number | "ALL";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: CategorySelection;
  onSelectCategory: (categoryId: CategorySelection) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) => {
  const navRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLElement>>(new Map());

  const handleWheel = (e: React.WheelEvent) => {
    if (navRef.current && e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const activePill = pillRefs.current.get(String(selectedCategoryId));
    activePill?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedCategoryId]);

  return (
    <div
      ref={navRef}
      onWheel={handleWheel}
      className="overflow-auto no-scrollbar category-scroll-container py-1"
    >
      <Nav
        variant="pills"
        activeKey={String(selectedCategoryId)}
        onSelect={(selectedKey) => {
          if (!selectedKey) return;
          onSelectCategory(selectedKey === "ALL" ? "ALL" : Number(selectedKey));
        }}
        className="custom-category-pills flex-nowrap px-3"
      >
        <Nav.Item>
          <Nav.Link
            ref={(el: HTMLElement | null) => {
              if (el) pillRefs.current.set("ALL", el);
              else pillRefs.current.delete("ALL");
            }}
            eventKey="ALL"
            className="px-3 py-1.5 me-1 fw-semibold small shadow-sm"
          >
            Tutti
          </Nav.Link>
        </Nav.Item>
        {categories.map((cat) => (
          <Nav.Item key={cat.id}>
            <Nav.Link
              ref={(el: HTMLElement | null) => {
                if (el) pillRefs.current.set(String(cat.id), el);
                else pillRefs.current.delete(String(cat.id));
              }}
              eventKey={String(cat.id)}
              className="px-3 py-1.5 me-1 fw-semibold small shadow-sm"
            >
              {cat.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

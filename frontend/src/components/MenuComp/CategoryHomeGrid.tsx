import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import type { Category } from "../../interfaces/Product";

interface CategoryHomeGridProps {
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  onSelectAll: () => void;
}

export const CategoryHomeGrid: React.FC<CategoryHomeGridProps> = ({
  categories,
  onSelectCategory,
  onSelectAll,
}) => {
  return (
    <Row className="g-3 py-4">
      <Col xs={6} md={4}>
        <Card
          role="button"
          className="h-100 text-center shadow-sm bg-dark text-white border-0"
          style={{ cursor: "pointer", minHeight: "160px" }}
          onClick={onSelectAll}
        >
          <Card.Body className="d-flex align-items-center justify-content-center">
            <Card.Title className="fw-bold fs-3 mb-0">
              Tutti i Prodotti
            </Card.Title>
          </Card.Body>
        </Card>
      </Col>
      {categories.map((cat) => (
        <Col xs={6} md={4} key={cat.id}>
          <Card
            role="button"
            className="h-100 text-center shadow-sm card-border-custom bg-custom-theme"
            style={{ cursor: "pointer", minHeight: "160px" }}
            onClick={() => onSelectCategory(cat.id)}
          >
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Card.Title className="fw-bold fs-3 mb-0 custom-black-color">
                {cat.name}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

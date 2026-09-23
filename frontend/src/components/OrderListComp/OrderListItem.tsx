import React from "react";
import { ListGroup } from "react-bootstrap";
import type { OrderItem } from "../../interfaces/Order";

interface ItemProps {
  item: OrderItem;
  isTakeaway: boolean;
}

export const OrderListItem: React.FC<ItemProps> = ({ item, isTakeaway }) => {
  const activeUnitPrice = isTakeaway
    ? (item.takeawayUnitPrice ?? item.unitPrice ?? 0)
    : (item.unitPrice ?? 0);

  const extrasUnitPrice =
    item.extras?.reduce((sum, extra) => sum + (extra.price ?? 0), 0) ?? 0;

  const lineTotal = (activeUnitPrice + extrasUnitPrice) * item.quantity;

  return (
    <ListGroup.Item className="bg-custom-theme border-bottom d-flex justify-content-between align-items-center w-100 text-start px-3 py-2">
      <div className="d-flex align-items-center me-auto">
        <span
          className="badge bg-dark me-2 d-flex align-items-center justify-content-center"
          style={{ minWidth: "32px", height: "32px", fontSize: "0.85rem" }}
        >
          {item.quantity}x
        </span>

        <div>
          <div className="fw-semibold custom-black-color">
            {item.productName ?? "Prodotto"}
          </div>
          {item.extras && item.extras.length > 0 && (
            <div>
              {item.extras.map((extra, i) => {
                const isPositive = extra.price >= 0;
                return (
                  <small
                    key={i}
                    className={`d-block ${isPositive ? "text-success" : "text-danger"}`}
                  >
                    {isPositive ? "+ " : "- "}
                    <span className="fw-bold">
                      {extra.ingredientName}
                    </span> (€ {Math.abs(extra.price).toFixed(2)})
                  </small>
                );
              })}
            </div>
          )}
          {item.removedIngredients && item.removedIngredients.length > 0 && (
            <div>
              {item.removedIngredients.map((name, i) => (
                <small key={i} className="d-block text-muted">
                  Senza{" "}
                  <span className="fw-bold text-decoration-line-through">
                    {name}
                  </span>
                </small>
              ))}
            </div>
          )}
          {item.notes && (
            <small className="text-muted d-block">Note: {item.notes}</small>
          )}
        </div>
      </div>
      <span className="fw-bold text-nowrap ms-2 product-price-calculated">
        € {lineTotal.toFixed(2)}
      </span>
    </ListGroup.Item>
  );
};

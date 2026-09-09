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
          {item.notes && (
            <small className="text-muted d-block">Note: {item.notes}</small>
          )}
        </div>
      </div>
      <span className="fw-bold text-nowrap ms-2 product-price-calculated">
        € {(activeUnitPrice * item.quantity).toFixed(2)}
      </span>
    </ListGroup.Item>
  );
};

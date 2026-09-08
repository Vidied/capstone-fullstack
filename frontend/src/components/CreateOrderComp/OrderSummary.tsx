import React from "react";
import { Card, Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import type { CartItem, OrderType } from "../../interfaces/Order";

interface OrderSummaryProps {
  cart: CartItem[];
  tableNumber: string;
  coverCount: string;
  orderType: OrderType;
  generalNotes: string;
  onTableNumberChange: (value: string) => void;
  onCoverCountChange: (value: string) => void;
  onOrderTypeChange: (type: OrderType) => void;
  onGeneralNotesChange: (notes: string) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  onRemoveItem: (index: number) => void;
  onSubmitOrder: () => void;
  isSubmitting: boolean;
  isTakeaway: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  tableNumber,
  coverCount,
  orderType,
  generalNotes,
  onTableNumberChange,
  onCoverCountChange,
  onOrderTypeChange,
  onGeneralNotesChange,
  onUpdateQuantity,
  onUpdateNotes,
  onRemoveItem,
  onSubmitOrder,
  isSubmitting,
  isTakeaway,
}) => {
  const totalAmount = cart.reduce((sum, item) => {
    const price = isTakeaway
      ? (item.product.takeawayPrice ?? item.product.price)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const isTableProvided = tableNumber.trim() !== "";
  const isCoverProvided = coverCount.toString().trim() !== "";

  const isTableValid =
    orderType === "ASPORTO" ||
    (orderType === "TAVOLO" && isTableProvided && isCoverProvided);

  const isFormValid = cart.length > 0 && isTableValid;

  return (
    <Card
      className="bg-custom-theme shadow-sm sticky-top card-border-custom"
      style={{ top: "1rem" }}
    >
      <Card.Header className="border-bottom bg-custom-theme fw-bold h5 py-3">
        Riepilogo Comanda
      </Card.Header>

      <Card.Body>
        <Form className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted fw-semibold">
              Tipo Comanda
            </Form.Label>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant={
                  orderType === "TAVOLO" ? "primary" : "outline-secondary"
                }
                className={`w-50 ${orderType === "TAVOLO" ? "toggle-btn-active" : "toggle-btn-inactive"}`}
                onClick={() => onOrderTypeChange("TAVOLO")}
              >
                Tavolo
              </Button>
              <Button
                size="sm"
                variant={
                  orderType === "ASPORTO" ? "primary" : "outline-secondary"
                }
                className={`w-50 ${orderType === "ASPORTO" ? "toggle-btn-active" : "toggle-btn-inactive"}`}
                onClick={() => onOrderTypeChange("ASPORTO")}
              >
                Asporto
              </Button>
            </div>
          </Form.Group>

          {orderType === "TAVOLO" && (
            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small text-muted fw-semibold">
                  N. Tavolo *
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Es. 5"
                  value={tableNumber}
                  isInvalid={orderType === "TAVOLO" && !isTableProvided}
                  onChange={(e) => onTableNumberChange(e.target.value)}
                  className="bg-custom-theme card-border-custom"
                />
                <Form.Control.Feedback type="invalid">
                  Obbligatorio.
                </Form.Control.Feedback>
              </div>

              <div className="col-6">
                <Form.Label className="small text-muted fw-semibold">
                  Coperti *
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Es. 4"
                  value={coverCount}
                  isInvalid={
                    orderType === "TAVOLO" &&
                    isTableProvided &&
                    !isCoverProvided
                  }
                  onChange={(e) => onCoverCountChange(e.target.value)}
                  className="bg-custom-theme card-border-custom"
                />
                <Form.Control.Feedback type="invalid">
                  Obbligatori.
                </Form.Control.Feedback>
              </div>
            </div>
          )}

          <Form.Group className="mb-2">
            <Form.Label className="small text-muted fw-semibold">
              Note Ordine (Opzionali)
            </Form.Label>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Es. Servire prima i bambini"
              value={generalNotes}
              onChange={(e) => onGeneralNotesChange(e.target.value)}
              className="bg-custom-theme card-border-custom"
            />
          </Form.Group>
        </Form>

        <hr className="border-top" />

        {cart.length === 0 ? (
          <p className="text-muted text-center py-4 my-0">
            Nessun piatto inserito in comanda.
          </p>
        ) : (
          <ListGroup variant="flush" className="mb-3">
            {cart.map(({ product, quantity, notes }, index) => {
              const activeItemPrice = isTakeaway
                ? (product.takeawayPrice ?? product.price)
                : product.price;

              return (
                <ListGroup.Item
                  key={`${product.id}-${index}`}
                  className="bg-custom-theme border-bottom px-0 py-2"
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-bold me-2">{product.name}</span>
                    <span className="text-success fw-bold">
                      € {(activeItemPrice * quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <InputGroup size="sm" style={{ width: "110px" }}>
                      <Button
                        variant="outline-dark"
                        className="card-border-custom"
                        onClick={() =>
                          onUpdateQuantity(index, Math.max(1, quantity - 1))
                        }
                      >
                        -
                      </Button>
                      <Form.Control
                        readOnly
                        value={quantity}
                        className="bg-custom-theme text-dark text-center px-1 card-border-custom"
                      />
                      <Button
                        variant="outline-dark"
                        className="card-border-custom"
                        onClick={() => onUpdateQuantity(index, quantity + 1)}
                      >
                        +
                      </Button>
                    </InputGroup>

                    <Button
                      variant="link"
                      className="text-danger p-0 text-decoration-none small"
                      onClick={() => onRemoveItem(index)}
                    >
                      Rimuovi
                    </Button>
                  </div>

                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Note piatto"
                    value={notes || ""}
                    onChange={(e) => onUpdateNotes(index, e.target.value)}
                    className="bg-custom-theme card-border-custom text-dark"
                  />
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}

        <hr className="border-top" />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="order-total-label">Totale:</span>
          <span className="order-total-amount">€ {totalAmount.toFixed(2)}</span>
        </div>

        <Button
          variant="success"
          size="lg"
          className="w-100 fw-bold shadow-sm"
          disabled={!isFormValid || isSubmitting}
          onClick={onSubmitOrder}
        >
          {isSubmitting ? "Invio in corso..." : "Invia Comanda"}
        </Button>
      </Card.Body>
    </Card>
  );
};

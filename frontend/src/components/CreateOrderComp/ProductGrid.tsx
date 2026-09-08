import React from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Spinner,
  InputGroup,
  Form,
} from "react-bootstrap";
import type { CartItem } from "../../interfaces/Order";
import type { Product } from "../../interfaces/Product";

interface ProductGridProps {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  isTakeaway: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cart,
  isLoading,
  error,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  isTakeaway,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        Nessun prodotto trovato.
      </div>
    );
  }

  return (
    <Row className="row-cols-1 row-cols-md-2 g-3">
      {products.map((product) => {
        const cartItemIndex = cart.findIndex(
          (item) =>
            item.product.id === product.id &&
            (!item.notes || item.notes.trim() === ""),
        );
        const cartItem = cartItemIndex !== -1 ? cart[cartItemIndex] : null;

        const activePrice = isTakeaway
          ? (product.takeawayPrice ?? product.price)
          : product.price;

        return (
          <Col key={product.id}>
            <Card className="h-100 bg-custom-theme shadow-sm product-card-clean card-border-custom">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="h6 fw-bold mb-2 text-truncate-2 custom-black-color">
                    {product.name}
                  </Card.Title>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="fw-bold text-success h6 mb-0">
                    € {activePrice.toFixed(2)}
                  </span>

                  {cartItem ? (
                    <div className="d-flex align-items-center gap-2">
                      <InputGroup size="sm" style={{ width: "100px" }}>
                        <Button
                          variant="outline-dark"
                          className="card-border-custom"
                          onClick={() => {
                            if (cartItem.quantity > 1) {
                              onUpdateQuantity(
                                cartItemIndex,
                                cartItem.quantity - 1,
                              );
                            } else {
                              onRemoveItem(cartItemIndex);
                            }
                          }}
                        >
                          -
                        </Button>
                        <Form.Control
                          readOnly
                          value={cartItem.quantity}
                          className="bg-custom-theme text-center px-1 card-border-custom"
                        />
                        <Button
                          variant="outline-dark"
                          className="card-border-custom"
                          onClick={() =>
                            onUpdateQuantity(
                              cartItemIndex,
                              cartItem.quantity + 1,
                            )
                          }
                        >
                          +
                        </Button>
                      </InputGroup>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onAddToCart(product)}
                    >
                      + Aggiungi
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

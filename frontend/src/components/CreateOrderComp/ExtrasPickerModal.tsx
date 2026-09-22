import React, { useMemo, useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import type { CartItemExtra } from "../../interfaces/Order";
import type { Ingredient } from "../../interfaces/Product";

interface ExtrasPickerModalProps {
  show: boolean;
  onHide: () => void;
  ingredients: Ingredient[];
  selectedExtras: CartItemExtra[];
  onConfirm: (extras: CartItemExtra[]) => void;
}

export const ExtrasPickerModal: React.FC<ExtrasPickerModalProps> = ({
  show,
  onHide,
  ingredients,
  selectedExtras,
  onConfirm,
}) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    () => new Set(selectedExtras.map((e) => e.ingredientId)),
  );

  const availableIngredients = useMemo(
    () =>
      ingredients
        .filter((ing) => ing.isAvailable)
        .filter((ing) =>
          ing.name.toLowerCase().includes(search.toLowerCase().trim()),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [ingredients, search],
  );

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const extras: CartItemExtra[] = ingredients
      .filter((ing) => selectedIds.has(ing.id))
      .map((ing) => ({
        ingredientId: ing.id,
        ingredientName: ing.name,
        price: ing.extraPrice,
      }));
    onConfirm(extras);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Aggiungi Extra</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <Form.Control
          type="text"
          placeholder="Cerca ingrediente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
          autoFocus
        />
        <ListGroup style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {availableIngredients.map((ing) => (
            <ListGroup.Item
              key={ing.id}
              action
              onClick={() => toggle(ing.id)}
              className="d-flex justify-content-between align-items-center"
            >
              <Form.Check
                type="checkbox"
                label={ing.name}
                checked={selectedIds.has(ing.id)}
                onChange={() => toggle(ing.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span
                className={
                  ing.extraPrice >= 0
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {ing.extraPrice >= 0 ? "+" : ""}€ {ing.extraPrice.toFixed(2)}
              </span>
            </ListGroup.Item>
          ))}
          {availableIngredients.length === 0 && (
            <ListGroup.Item className="text-muted text-center py-3">
              Nessun ingrediente trovato.
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="success" className="fw-bold" onClick={handleConfirm}>
          Conferma ({selectedIds.size})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

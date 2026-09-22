import React, { useMemo, useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";

interface RemoveIngredientsModalProps {
  show: boolean;
  onHide: () => void;
  availableIngredientNames: string[];
  selectedNames: string[];
  onConfirm: (names: string[]) => void;
}

export const RemoveIngredientsModal: React.FC<RemoveIngredientsModalProps> = ({
  show,
  onHide,
  availableIngredientNames,
  selectedNames,
  onConfirm,
}) => {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(selectedNames),
  );

  const uniqueNames = useMemo(
    () =>
      Array.from(new Set(availableIngredientNames)).sort((a, b) =>
        a.localeCompare(b),
      ),
    [availableIngredientNames],
  );

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered scrollable>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          Togli Ingredienti
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        {uniqueNames.length === 0 ? (
          <p className="text-muted text-center py-3 mb-0">
            Questo prodotto non ha ingredienti elencati.
          </p>
        ) : (
          <ListGroup>
            {uniqueNames.map((name) => (
              <ListGroup.Item key={name} action onClick={() => toggle(name)}>
                <Form.Check
                  type="checkbox"
                  label={name}
                  checked={selected.has(name)}
                  onChange={() => toggle(name)}
                  onClick={(e) => e.stopPropagation()}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="danger" className="fw-bold" onClick={handleConfirm}>
          Conferma ({selected.size})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

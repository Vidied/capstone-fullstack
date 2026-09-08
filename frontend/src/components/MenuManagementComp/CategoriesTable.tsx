import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import type { Category } from "../../interfaces/Product";
import { ActionButtons } from "./ActionButtons";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  onAddNew: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="shadow-sm bg-custom-theme card-border-custom">
      <Card.Header className="d-flex justify-content-between align-items-center modal-header-custom">
        <h5 className="mb-0 modal-title-custom">Gestione Categorie</h5>
        <Button
          variant="success"
          size="sm"
          onClick={onAddNew}
          className="fw-bold"
        >
          + Nuova Categoria
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr className="bg-custom-theme border-bottom">
              <th style={{ width: "100px" }} className="text-center py-3">
                Ordine
              </th>
              <th className="py-3">Nome Categoria</th>
              <th className="text-end py-3 pe-3" style={{ width: "1%" }}>
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-bottom">
                <td className="text-center fw-bold">
                  #{cat.displayOrder ?? "-"}
                </td>
                <td className="fw-bold ps-3">
                  <span className="text-truncate-2" title={cat.name}>
                    {cat.name}
                  </span>
                </td>
                <td className="text-end pe-3">
                  <ActionButtons
                    onEdit={() => onEdit(cat)}
                    onDelete={() => onDelete(cat.id)}
                  />
                </td>
              </tr>
            ))}
            {categories.length === 0 && !isLoading && (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Nessuna categoria trovata.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

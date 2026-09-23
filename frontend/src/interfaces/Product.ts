import type { DestinationArea } from "./Order";

export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface CategoryRequestDTO {
  name: string;
  displayOrder?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  takeawayPrice?: number;
  isAvailable: boolean;
  categoryId?: number;
  categoryName?: string;
  category?: Category;
  ingredientNames?: string[];
  ingredients?: Ingredient[];
  allergens?: Allergen[];
  destinationArea: DestinationArea;
}

export interface ProductDTO {
  name: string;
  description?: string;
  price: number;
  isAvailable?: boolean;
  categoryId: number;
  ingredientIds: number[];
  allergens?: Allergen[];
}

export interface ProductRequestDTO {
  name: string;
  description?: string;
  price: number;
  takeawayPrice?: number;
  isAvailable?: boolean;
  categoryId: number;
  ingredientIds?: number[];
  allergens?: Allergen[];
  destinationArea?: DestinationArea;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description?: string;
  price: number;
  takeawayPrice?: number;
  isAvailable: boolean;
  categoryId?: number;
  categoryName?: string;
  ingredientNames?: string[];
  destinationArea: DestinationArea;
}

export interface Ingredient {
  id: number;
  name: string;
  isAvailable: boolean;
  extraPrice: number;
}

export interface IngredientRequestDTO {
  name: string;
  isAvailable: boolean;
  extraPrice?: number;
}

export type Allergen =
  | "GLUTINE"
  | "CROSTACEI"
  | "UOVA"
  | "PESCE"
  | "ARACHIDI"
  | "SOIA"
  | "LATTE"
  | "FRUTTA_A_GUSCIO"
  | "SEDANO"
  | "SENAPE"
  | "SESAMO"
  | "SOLFITI"
  | "LUPINI"
  | "MOLLUSCHI";

export const ALL_ALLERGENS: Allergen[] = [
  "GLUTINE",
  "CROSTACEI",
  "UOVA",
  "PESCE",
  "ARACHIDI",
  "SOIA",
  "LATTE",
  "FRUTTA_A_GUSCIO",
  "SEDANO",
  "SENAPE",
  "SESAMO",
  "SOLFITI",
  "LUPINI",
  "MOLLUSCHI",
];

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  GLUTINE: "Glutine",
  CROSTACEI: "Crostacei",
  UOVA: "Uova",
  PESCE: "Pesce",
  ARACHIDI: "Arachidi",
  SOIA: "Soia",
  LATTE: "Latte e derivati",
  FRUTTA_A_GUSCIO: "Frutta a guscio",
  SEDANO: "Sedano",
  SENAPE: "Senape",
  SESAMO: "Sesamo",
  SOLFITI: "Anidride solforosa e solfiti",
  LUPINI: "Lupini",
  MOLLUSCHI: "Molluschi",
};

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  Spinner,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CategoryFilter } from "../components/MenuComp/CategoryFilter";
import { ProductCard } from "../components/MenuComp/ProductCard";
import { SearchBar } from "../components/CommonComp/SearchBar";
import { fetchCategoriesThunk } from "../features/slices/categorySlice";
import { fetchProductsThunk } from "../features/slices/productSlice";

export const MenuPage = () => {
  const dispatch = useAppDispatch();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isTakeaway, setIsTakeaway] = useState<boolean>(false);
  const {
    categories,
    loading: loadingCat,
    error: errorCat,
  } = useAppSelector((state) => state.categories);

  const {
    products,
    loading: loadingProd,
    error: errorProd,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  const isLoading = loadingCat || loadingProd;
  const generalError = errorCat || errorProd;

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.toLowerCase().trim();

    const matchesName = product.name.toLowerCase().includes(query);

    const rawIngredients = product.ingredientNames || product.ingredients || [];

    const matchesIngredient = rawIngredients.some((ing) => {
      if (!ing) return false;

      const ingredientName = typeof ing === "string" ? ing : ing.name;
      return ingredientName
        ? ingredientName.toLowerCase().includes(query)
        : false;
    });

    const matchesDescription = product.description
      ? product.description.toLowerCase().includes(query)
      : false;

    const matchSearch = matchesName || matchesIngredient || matchesDescription;

    if (query.length > 0) {
      return matchSearch;
    }

    return selectedCategoryId !== null
      ? product.categoryId === selectedCategoryId
      : true;
  });

  return (
    <div className="menu-page-bg min-vh-100 py-4 position-relative">
      <Container>
        <div className="d-flex flex-column-reverse flex-md-row justify-content-between align-items-center gap-3 mb-3">
          <div className="w-100">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Cerca piatto o ingrediente..."
            />
          </div>

          <ButtonGroup className="shadow-sm rounded-pill overflow-hidden border border-dark-subtle flex-shrink-0">
            <Button
              className={`px-3 py-2 fw-semibold border-0 fs-7 ${!isTakeaway ? "toggle-btn-active" : "toggle-btn-inactive"}`}
              onClick={() => setIsTakeaway(false)}
            >
              Al Tavolo
            </Button>
            <Button
              className={`px-3 py-2 fw-semibold border-0 fs-7 ${isTakeaway ? "toggle-btn-active" : "toggle-btn-inactive"}`}
              onClick={() => setIsTakeaway(true)}
            >
              Asporto
            </Button>
          </ButtonGroup>
        </div>

        <div className="mb-4 pb-2 border-bottom border-dark-subtle">
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
          />
        </div>
        {isLoading && (
          <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="dark" />
          </div>
        )}
        {generalError && <Alert variant="danger">{generalError}</Alert>}
        {!isLoading && !generalError && (
          <div>
            {filteredProducts.length === 0 ? (
              <Alert variant="warning" className="text-center mt-3">
                Nessun piatto trovato per i filtri selezionati
              </Alert>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isTakeaway={isTakeaway}
                />
              ))
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

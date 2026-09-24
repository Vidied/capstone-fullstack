import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AttiviColumn } from "../components/OrderListComp/AttiviColumn";
import { ConfirmDeleteModal } from "../components/CommonComp/ConfirmDeleteModal";
import { OrderCard } from "../components/OrderListComp/OrderCard";
import { OrderFilterHeader } from "../components/OrderListComp/OrderFilterHeader";
import {
  clearOrderMessages,
  deleteCancelledOrdersThunk,
  deleteCompletedOrdersThunk,
  deleteOrdersThunk,
  fetchOrdersThunk,
  printOrderThunk,
  printReceiptThunk,
  updateOrderStatusThunk,
} from "../features/slices/orderSlice";
import type { Order, OrderStatus } from "../interfaces/Order";

type BulkDeleteTarget = "COMPLETED" | "CANCELLED" | null;

export const OrdersListPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, errorMessage, successMessage } = useAppSelector(
    (state) => state.orders,
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("ATTIVI");
  const [bulkDeleteTarget, setBulkDeleteTarget] =
    useState<BulkDeleteTarget>(null);

  const [autoPrintOnComplete, setAutoPrintOnComplete] = useState<boolean>(
    () => localStorage.getItem("autoPrintOnComplete") === "true",
  );

  const handleToggleAutoPrint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAutoPrintOnComplete(checked);
    localStorage.setItem("autoPrintOnComplete", String(checked));
  };

  useEffect(() => {
    dispatch(fetchOrdersThunk());

    const intervalId = setInterval(() => {
      dispatch(fetchOrdersThunk());
    }, 10000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearOrderMessages());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  const handlePrintFullTicket = (order: Order) => {
    dispatch(printReceiptThunk(order.id));
  };

  const handleReprintComanda = (order: Order) => {
    dispatch(printOrderThunk(order.id));
  };

  const handleDeleteSingleOrder = (orderId: number) => {
    dispatch(deleteOrdersThunk(orderId));
  };

  const handleNextStatus = (orderId: number, currentStatus: OrderStatus) => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      PENDING: "PREPARATION",
      PREPARATION: "READY",
      READY: "SERVED",
      SERVED: "COMPLETED",
      COMPLETED: null,
      CANCELLED: null,
    };

    const nextStatus = statusFlow[currentStatus];
    if (nextStatus) {
      if (
        currentStatus === "SERVED" &&
        nextStatus === "COMPLETED" &&
        autoPrintOnComplete
      ) {
        const orderToPrint = orders.find((o) => o.id === orderId);
        if (orderToPrint) {
          handlePrintFullTicket(orderToPrint);
        }
      }

      dispatch(
        updateOrderStatusThunk({
          orderId,
          data: { orderStatus: nextStatus },
        }),
      );
    }
  };

  const handleCancelOrder = async (
    orderId: number,
    _tableNumber?: number | string | null,
    _orderType: string = "TAVOLO",
  ) => {
    await dispatch(
      updateOrderStatusThunk({ orderId, data: { orderStatus: "CANCELLED" } }),
    );
  };

  const handleConfirmBulkDelete = () => {
    if (bulkDeleteTarget === "COMPLETED") {
      dispatch(deleteCompletedOrdersThunk());
    } else if (bulkDeleteTarget === "CANCELLED") {
      dispatch(deleteCancelledOrdersThunk());
    }
    setBulkDeleteTarget(null);
  };

  const {
    pendingOrders,
    preparationOrders,
    readyOrders,
    specificFilteredOrders,
    completedCount,
    cancelledCount,
  } = useMemo(() => {
    return {
      pendingOrders: orders.filter((o) => o.orderStatus === "PENDING"),
      preparationOrders: orders.filter((o) => o.orderStatus === "PREPARATION"),
      readyOrders: orders.filter((o) => o.orderStatus === "READY"),
      specificFilteredOrders: orders.filter(
        (o) => o.orderStatus === selectedStatus,
      ),
      completedCount: orders.filter((o) => o.orderStatus === "COMPLETED")
        .length,
      cancelledCount: orders.filter((o) => o.orderStatus === "CANCELLED")
        .length,
    };
  }, [orders, selectedStatus]);

  const rightAction = useMemo(() => {
    if (selectedStatus === "SERVED") {
      return (
        <Form.Check
          type="switch"
          id="auto-print-switch"
          label="Stampa automatica all'incasso"
          checked={autoPrintOnComplete}
          onChange={handleToggleAutoPrint}
          className="text-secondary fw-semibold mb-0"
        />
      );
    }
    if (selectedStatus === "COMPLETED" && completedCount > 0) {
      return (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => setBulkDeleteTarget("COMPLETED")}
        >
          Pulisci Completati ({completedCount})
        </Button>
      );
    }
    if (selectedStatus === "CANCELLED" && cancelledCount > 0) {
      return (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => setBulkDeleteTarget("CANCELLED")}
        >
          Pulisci Cancellati ({cancelledCount})
        </Button>
      );
    }
    return null;
  }, [selectedStatus, autoPrintOnComplete, completedCount, cancelledCount]);

  return (
    <Container fluid className="py-4 min-vh-100 menu-page-bg">
      <OrderFilterHeader
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        rightAction={rightAction}
      />

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loading && orders.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : selectedStatus === "ATTIVI" ? (
        <Row className="g-3">
          <AttiviColumn
            title="In Attesa"
            orders={pendingOrders}
            status="PENDING"
            emptyMessage="Nessuna comanda in attesa."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
            onPrintTicket={handlePrintFullTicket}
            onReprintComanda={handleReprintComanda}
            onDeleteSingleOrder={handleDeleteSingleOrder}
          />
          <AttiviColumn
            title="In Preparazione"
            orders={preparationOrders}
            status="PREPARATION"
            emptyMessage="Nessun ordine in cucina."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
            onPrintTicket={handlePrintFullTicket}
            onReprintComanda={handleReprintComanda}
            onDeleteSingleOrder={handleDeleteSingleOrder}
          />
          <AttiviColumn
            title="Pronti per la Sala"
            orders={readyOrders}
            status="READY"
            emptyMessage="Nessun ordine in attesa di uscita."
            onNextStatus={handleNextStatus}
            onCancelOrder={handleCancelOrder}
            onPrintTicket={handlePrintFullTicket}
            onReprintComanda={handleReprintComanda}
            onDeleteSingleOrder={handleDeleteSingleOrder}
          />
        </Row>
      ) : (
        <Row className="g-3">
          {specificFilteredOrders.length === 0 ? (
            <div className="text-center text-muted py-5">
              Nessun ordine trovato per lo stato selezionato.
            </div>
          ) : (
            specificFilteredOrders.map((order) => (
              <Col md={6} lg={4} key={order.id}>
                <OrderCard
                  order={order}
                  onNextStatus={handleNextStatus}
                  onCancelOrder={handleCancelOrder}
                  onPrintTicket={handlePrintFullTicket}
                  onReprintComanda={handleReprintComanda}
                  onDeleteSingleOrder={handleDeleteSingleOrder}
                />
              </Col>
            ))
          )}
        </Row>
      )}

      <ConfirmDeleteModal
        show={bulkDeleteTarget !== null}
        title="Conferma Eliminazione di Massa"
        message={
          bulkDeleteTarget === "COMPLETED"
            ? `Sei sicuro di voler eliminare tutti gli ordini completati (${completedCount})?`
            : `Sei sicuro di voler eliminare tutti gli ordini cancellati (${cancelledCount})?`
        }
        confirmButtonText={
          bulkDeleteTarget === "COMPLETED"
            ? "Elimina Tutti i Completati"
            : "Elimina Tutti i Cancellati"
        }
        onHide={() => setBulkDeleteTarget(null)}
        onConfirm={handleConfirmBulkDelete}
      />
    </Container>
  );
};

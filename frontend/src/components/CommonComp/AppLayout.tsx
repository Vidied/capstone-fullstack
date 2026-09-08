import React, { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";
import { Footer } from "./Footer";
import helmetLogo from "../../assets/png-transparent-medieval-greek-warrior-helmet-thumbnail.svg";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [expanded, setExpanded] = useState<boolean>(false);

  const isAdmin =
    Boolean(token) && Boolean(user?.roles?.includes("ROLE_ADMIN"));

  const handleLogout = () => {
    dispatch(logout());
    setExpanded(false);
    navigate("/menu");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        variant="light"
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        className="px-3 border-bottom border-dark-subtle navbar-custom"
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/menu"
            onClick={() => setExpanded(false)}
            className="d-flex align-items-center gap-2 navbar-brand-custom"
          >
            <img src={helmetLogo} alt="Elmo Pizzeria" className="navbar-logo" />
            <span className="navbar-title">Pizzeria La Storia</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar"
            className="border-0 shadow-none p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="text-dark"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </Navbar.Toggle>

          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/menu" onClick={() => setExpanded(false)}>
                Menù
              </Nav.Link>

              {isAdmin && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/create-order"
                    onClick={() => setExpanded(false)}
                  >
                    Nuova Comanda
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/order-list"
                    onClick={() => setExpanded(false)}
                  >
                    Gestione Ordini
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/menu-management"
                    onClick={() => setExpanded(false)}
                  >
                    Gestione Menù
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="ms-auto align-items-lg-center gap-2">
              {token ? (
                <>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => setExpanded(false)}
                >
                  Area Riservata / Login
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">{children}</main>

      <Footer />
    </div>
  );
};

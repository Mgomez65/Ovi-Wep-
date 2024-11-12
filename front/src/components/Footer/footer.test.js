import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "./footer";
import { BrowserRouter as Router } from "react-router-dom";

describe("Footer", () => {
  beforeAll(() => {
    global.open = jest.fn();
  });

  test("debe mostrar el correo de contacto correctamente", () => {
    render(
      <Router>
        <Footer />
      </Router>
    );
    
    expect(screen.getByText("info@ovi.com")).toBeInTheDocument();
  });

  test("debe mostrar los enlaces de navegación correctamente", () => {
    render(
      <Router>
        <Footer />
      </Router>
    );

    expect(screen.getByText("Sobre Nosotros")).toBeInTheDocument();
    expect(screen.getByText("Términos y Condiciones")).toBeInTheDocument();
    expect(screen.getByText("Política de Privacidad")).toBeInTheDocument();
  });

  test("debe abrir los enlaces en una nueva pestaña cuando se haga clic", () => {
    render(
      <Router>
        <Footer />
      </Router>
    );

    fireEvent.click(screen.getByText("Sobre Nosotros"));

    expect(global.open).toHaveBeenCalledWith("/about", "_blank", "noopener,noreferrer");
  });

  test("debe renderizar correctamente el logo", () => {
    render(
      <Router>
        <Footer />
      </Router>
    );

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/Logo-Ovi.png");
  });

  test('debería abrir una nueva pestaña', () => {
    const url = 'https://example.com';
    
    global.open(url, '_blank', 'noopener,noreferrer');
    
    expect(global.open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
  });

  afterAll(() => {
    global.open.mockRestore();
  });
});

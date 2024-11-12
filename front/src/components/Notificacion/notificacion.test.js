import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmacionTemporal from "./notificacionTemporal";

describe("ConfirmacionTemporal", () => {
  test("debe mostrar el mensaje correctamente", () => {
    render(<ConfirmacionTemporal mensaje="Mensaje de prueba" onClose={() => {}} shouldReload={false} />);
    
    expect(screen.getByText("Mensaje de prueba")).toBeInTheDocument();
  });

  test("debe ocultarse al hacer clic en 'Cerrar' y llamar a onClose", () => {
    const onCloseMock = jest.fn();
    render(<ConfirmacionTemporal mensaje="Mensaje de prueba" onClose={onCloseMock} shouldReload={false} />);
    
    fireEvent.click(screen.getByText("Cerrar"));
    
    expect(onCloseMock).toHaveBeenCalled();

    expect(screen.queryByText("Mensaje de prueba")).not.toBeInTheDocument();
  });
});

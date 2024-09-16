import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      {
        console.log(data);
      }
      const respuesta = await axios.post(
        "http://localhost:3000/api/login",
        data
      );

      if (respuesta.status == 200) {
        console.log("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        console.error("Error al iniciar sesión:", respuesta.data.error);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <>
      <div className="Login-Conteiner">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <label>Email:</label>
          <input
            {...register("Email", {
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email no válido",
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}

          <label>Contraseña:</label>
          <input
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            type="password"
          />
          {errors.password && <span>{errors.password.message}</span>}

          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </>
  );
};

export default Login;

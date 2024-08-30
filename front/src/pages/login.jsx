import React from "react";
import axios from "axios";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom"; 


const Login = () => {
  const navigate = useNavigate(); // Hook navigate

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Envío de los datos al backend
      const respuesta = await axios.post('/api/login', data);
      if (respuesta.data.success) {
        // Manejo de la respuesta exitosa (redirección a la página principal por ejemplo)
        console.log('Inicio de sesión exitoso');
        navigate("/"); // Redirect to main page after successful login
      } else {
        // Manejo de errores (por ejemplo, mostrar un mensaje de error)
        console.error('Error al iniciar sesión:', respuesta.data.error);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      reset(); // Resetear el formulario
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Email:</label>
      <input
        {...register("email", {
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
        {...register("password", { required: "La contraseña es requerida" })}
        type="password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
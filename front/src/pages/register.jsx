import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
/* import styled from 'styled-components'; */
import { useNavigate } from 'react-router-dom';

// Omitir estilos innecesarios para el ejemplo (puedes importarlos si los usas)
// import { Container, Form, Input, Button, ErrorMessage } from './styled';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { response } = await axios.post('http://localhost:3000/register', data);
    
      if (response.data.success) {
      
        // Redirigir a la página de inicio
        navigate('/');
      } else {
        setErrorMessage(response.data.message); // Manejar el mensaje de error del backend
      }
    } catch (error) {
      handleErrors(error); // Manejar errores de forma centralizada
    } finally {
      reset(); // Resetear el formulario
    }
  };

  const handleErrors = (error) => {
    if (error.response) {
      // Error específico del servidor (por ejemplo, 400 o 500)
      if (error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error desconocido del servidor');
      }
    } else if (error.request) {
      // Error de conexión con el servidor
      setErrorMessage('Error de conexión con el servidor');
    } else {
      // Otros errores (por ejemplo, errores de JavaScript)
      console.error('Error desconocido:', error.message);
      setErrorMessage('Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Nombre"
        {...register("name", { required: "El nombre es requerido" })}
      />
      {errors.name && <span>{errors.name.message}</span>}

      <input
        type="text"
        placeholder="Apellido"
        {...register("surname", { required: "El apellido es requerido" })}
      />
      {errors.surname && <span>{errors.surname.message}</span>}

      <input
        type="text"
        placeholder="DNI"
        {...register("dni", { required: "El DNI es requerido" })}
      />
      {errors.dni && <span>{errors.dni.message}</span>}

      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "El email es requerido",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email no válido",
          },
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        placeholder="Contraseña"
        {...register("password", { required: "La contraseña es requerida" })}
      />
      {errors.password && <span>{errors.password.message}</span>}

      {errorMessage && <span>{errorMessage}</span>}
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
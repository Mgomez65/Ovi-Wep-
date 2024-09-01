import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [errorMessage, setErrorMessage] = React.useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/register', data);

      if (response.status === 200) {
        navigate('/');
      } else {
        console.error('Error al iniciar sesión:', respuesta.data.error);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMessage('Error al registrar. Por favor, inténtalo de nuevo.');
    } finally {
      reset(); 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Nombre de usuario"
        {...register("Username", { required: "El nombre de usuario es requerido" })}
      />
      {errors.Username && <span>{errors.Username.message}</span>}

      <input
        type="password"
        placeholder="Contraseña"
        {...register("Password", { required: "La contraseña es requerida" })}
      />
      {errors.Password && <span>{errors.Password.message}</span>}

      <input
        type="email"
        placeholder="Email"
        {...register("Email", {
          required: "El email es requerido",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email no válido",
          },
        })}
      />
      {errors.Email && <span>{errors.Email.message}</span>}

      <input
        type="text"
        placeholder="DNI"
        {...register("DNI", { required: "El DNI es requerido" })}
      />
      {errors.DNI && <span>{errors.DNI.message}</span>}

      {/* Mostrar el mensaje de error en una etiqueta <p> */}
      {errorMessage && <p>{errorMessage}</p>}
      
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
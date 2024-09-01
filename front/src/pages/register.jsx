import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [selectedUser, setSelectedUser] = React.useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`
      );
      const userData = response.data;

      setValue("Username", userData.Username);
      setValue("Email", userData.Email);
      setValue("DNI", userData.DNI);
      setValue("Password", userData.Password);

      setSelectedUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/register",
        data
      );

      if (response.status === 200) {
        navigate("/home");
      } else {
        console.error("Error al iniciar sesión:", response.data.error);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setErrorMessage("Error al registrar. Por favor, inténtalo de nuevo.");
    } finally {
      reset();
    }
  };

  const onUpdate = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/actualizarUsers/${selectedUser.id}`,
        data
      );

      if (response.status === 200) {
        console.log("Usuario actualizado con éxito");
      } else {
        console.error("Error al actualizar el usuario:", response.data.error);
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    } finally {
      reset();
      setSelectedUser(null);
    }
  };

  const handleBackToRegister = () => {
    setSelectedUser(null);
    reset();
  };

  return (
    <>
      <Header />
      <div className="register-container">
        <div className="usuarios-container">
          <div className="usuarios-header">
            <h2>Lista de Usuarios</h2>
            <button onClick={handleBackToRegister} className="back-to-register-button">
              Volver a Registro
            </button>
          </div>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => handleUserClick(user.id)}
                  className="user-button"
                >
                  {user.Username}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="formulario-conteiner">
          {selectedUser ? (
            <form onSubmit={handleSubmit(onUpdate)}>
              <input
                type="text"
                placeholder="Nombre de usuario"
                {...register("Username", {
                  required: "El nombre de usuario es requerido",
                })}
              />
              {errors.Username && <span>{errors.Username.message}</span>}

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

              <input
                type="password"
                placeholder="Contraseña"
                {...register("Password", {
                  required: "La contraseña es requerida",
                })}
              />
              {errors.Password && <span>{errors.Password.message}</span>}

              <button type="submit">Actualizar Usuario</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Nombre de usuario"
                {...register("Username", {
                  required: "El nombre de usuario es requerido",
                })}
              />
              {errors.Username && <span>{errors.Username.message}</span>}

              <input
                type="password"
                placeholder="Contraseña"
                {...register("Password", {
                  required: "La contraseña es requerida",
                })}
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

              {errorMessage && <p>{errorMessage}</p>}

              <button type="submit">Registrarse</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;

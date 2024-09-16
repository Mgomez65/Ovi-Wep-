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
      setValue("CUIL", userData.CUIL);
      setValue("Apellido", userData.Apellido);
      setValue("Num_empleado", userData.Num_empleado);
      setValue("Direccion", userData.Direccion);
      setValue("Password", userData.Password);

      setSelectedUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
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
            <button
              onClick={handleBackToRegister}
              className="back-to-register-button"
            >
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
                  <p>
                    {user.Username} {user.Apellido}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="formulario-conteiner">
          {selectedUser ? (
            <form onSubmit={handleSubmit(onUpdate)}>
              <h2>Actualizar Usuario</h2>
              <div className="form-fields-container">
                <div className="form-field">
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    {...register("Username", {
                      required: "El nombre de usuario es requerido",
                    })}
                  />
                  {errors.Username && <span>{errors.Username.message}</span>}
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    placeholder="Apellido"
                    {...register("Apellido", {
                      required: "El apellido es requerido",
                    })}
                  />
                  {errors.Apellido && <span>{errors.Apellido.message}</span>}
                </div>
              </div>
              <input
                type="text"
                placeholder="CUIL"
                {...register("CUIL", { required: "El CUIL es requerido" })}
              />
              {errors.CUIL && <span>{errors.CUIL.message}</span>}

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
                placeholder="Número de empleado"
                {...register("Num_empleado", {
                  required: "El número de empleado es requerido",
                })}
              />
              {errors.Num_empleado && (
                <span>{errors.Num_empleado.message}</span>
              )}

              <input
                type="text"
                placeholder="Dirección"
                {...register("Direccion", {
                  required: "La dirección es requerida",
                })}
              />
              {errors.Direccion && <span>{errors.Direccion.message}</span>}

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
              <h2>Crear Nuevo Usuario</h2>
              <div className="form-fields-container">
                <div className="form-field">
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    {...register("Username", {
                      required: "El nombre de usuario es requerido",
                    })}
                  />
                  {errors.Username && <span>{errors.Username.message}</span>}
                </div>
                <div className="form-field">
                  <input
                    type="text"
                    placeholder="Apellido"
                    {...register("Apellido", {
                      required: "El apellido es requerido",
                    })}
                  />
                  {errors.Apellido && <span>{errors.Apellido.message}</span>}
                </div>
              </div>
              <input
                type="text"
                placeholder="CUIL"
                {...register("CUIL", { required: "El CUIL es requerido" })}
              />
              {errors.CUIL && <span>{errors.CUIL.message}</span>}

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
                placeholder="Número de empleado"
                {...register("Num_empleado", {
                  required: "El número de empleado es requerido",
                })}
              />
              {errors.Num_empleado && (
                <span>{errors.Num_empleado.message}</span>
              )}

              <input
                type="text"
                placeholder="Dirección"
                {...register("Direccion", {
                  required: "La dirección es requerida",
                })}
              />
              {errors.Direccion && <span>{errors.Direccion.message}</span>}

              <input
                type="password"
                placeholder="Contraseña"
                {...register("Password", {
                  required: "La contraseña es requerida",
                })}
              />
              {errors.Password && <span>{errors.Password.message}</span>}

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

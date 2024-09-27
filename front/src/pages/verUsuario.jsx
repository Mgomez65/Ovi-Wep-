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
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users", {
          withCredentials: true,
        });
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
        `http://localhost:3000/api/users/${userId}`, {
          withCredentials: true,
        }
      );
      const userData = response.data;

      setValue("Username", userData.Nombre);
      setValue("Email", userData.Email);
      setValue("CUIL", userData.CUIL);
      setValue("Apellido", userData.Apellido);
      setValue("Num_empleado", userData.Num_empleado);
      setValue("rol", userData.rol);
      setValue("Direccion", userData.Direccion);
      setValue("Password", userData.Password);

      setSelectedUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const respuesta = await response.json();
      alert(respuesta.message);
      if (response.ok) {
        alert(respuesta.message);
      }
    } catch (error) {
      alert("Error registrando usuario: " + error.message);
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
              <li key={user.Num_empleado}>
                <button
                  onClick={() => handleUserClick(user.Num_empleado)}
                  className="user-button"
                >
                  <p>
                    {user.Nombre} {user.Apellido}
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
                  {errors.Nombre && <span>{errors.Nombre.message}</span>}
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

              <div className="form-field">
                <select {...register("rol", { required: "El rol es requerido" })}>
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
                {errors.rol && <span>{errors.rol.message}</span>}
              </div>

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
                    {...register("Nombre", {
                      required: "El nombre de usuario es requerido",
                    })}
                  />
                  {errors.Nombre && <span>{errors.Nombre.message}</span>}
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
                {...register("CUIL", { 
                  required: "El CUIL es requerido",
                })}
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
                type="number"
                placeholder="Número de empleado"
                {...register("Num_empleado", {
                  required: "El número de empleado es requerido",
                  valueAsNumber: true 
                })}
              />
              {errors.Num_empleado && (
                <span>{errors.Num_empleado.message}</span>
              )}

              <div className="form-field">
                <select {...register("rol", { required: "El rol es requerido" })}>
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
                {errors.rol && <span>{errors.rol.message}</span>}
              </div>

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

              <button type="submit">Registrar Usuario</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;

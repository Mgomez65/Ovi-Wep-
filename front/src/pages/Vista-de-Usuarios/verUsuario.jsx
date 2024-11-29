import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import ConfirmacionTemporal from "../../components/Notificacion/notificacionTemporal"; // Importa el componente
import "./verUsuario.css";

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
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [modalMessage, setModalMessage] = useState(""); // Estado para el mensaje del modal

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users", {
          withCredentials: true,
        });
        console.log(response);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        {
          withCredentials: true,
        }
      );
      const userData = response.data;

      setValue("Nombre", userData.Nombre);
      setValue("Email", userData.Email);
      setValue("CUIL", userData.CUIL);
      setValue("Apellido", userData.Apellido);
      setValue("Num_empleado", userData.Num_empleado);
      setValue("rol", userData.rol);
      setValue("Dirrecion", userData.Dirrecion);
      setValue("Password", userData.Password);

      setSelectedUser(userData); // Asegúrate de que esto sea el objeto completo del usuario
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSubmit = async (data) => {
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

      // Muestra el modal con el mensaje de respuesta
      setModalMessage(respuesta.message);
      setModalVisible(true);

      if (response.ok) {
        // No necesitas alert aquí si usas el modal
      }
    } catch (error) {
      setModalMessage("Error registrando usuario: " + error.message);
      setModalVisible(true);
    }
  };

  const onUpdate = async (data) => {
    if (!selectedUser || !selectedUser.Num_empleado) {
      console.error("No hay un usuario seleccionado o el ID es indefinido.");
      setModalMessage("No se puede actualizar el usuario. ID indefinido.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/actualizarUsers/${selectedUser.Num_empleado}`,
        data,
        {
          withCredentials: true, // Para enviar cookies si es necesario
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token si es necesario
          },
        }
      );

      if (response.status === 200) {
        console.log("Usuario actualizado con éxito");
        setModalMessage("Usuario actualizado con éxito");
        setModalVisible(true);
      } else {
        console.error("Error al actualizar el usuario:", response.data.error);
        setModalMessage("Error al actualizar el usuario");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setModalMessage("Error al actualizar el usuario: " + error.message);
      setModalVisible(true);
    } finally {
      reset();
      setSelectedUser(null);
    }
  };

  const handleBackToRegister = () => {
    setSelectedUser(null);
    reset();
  };

  const closeModal = () => {
    setModalVisible(false);
    window.location.reload();
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
              {" "}
              {/* Cambiado aquí */}
              <h2>Actualizar Usuario</h2>
              <div className="form-fields-container">
                <div className="form-field">
                  <input
                    type="text"
                    placeholder="Nombre"
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
                <select
                  {...register("rol", { required: "El rol es requerido" })}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
                {errors.rol && <span>{errors.rol.message}</span>}
              </div>
              <input
                type="text"
                placeholder="Dirección"
                {...register("Dirrecion", {
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
                    placeholder="Nombre"
                    {...register("Nombre", {
                      required: "El nombre es requerido",
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
                <select
                  {...register("rol", { required: "El rol es requerido" })}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
                {errors.rol && <span>{errors.rol.message}</span>}
              </div>

              <input
                type="text"
                placeholder="Dirección"
                {...register("Dirrecion", {
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
      {modalVisible && (
        <ConfirmacionTemporal mensaje={modalMessage} onClose={closeModal} />
      )}
      <Footer />
    </>
  );
};

export default Register;

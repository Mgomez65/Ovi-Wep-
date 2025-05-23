
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./login.css";
import imagen from "../../assets/Login/Racimo-de-uva.png";

const Login = () => {
  const navigate = useNavigate();

  const handleCancelClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
  
      const respuesta = await response.json();
  
      console.log(respuesta, "entre");
  
      if (response.status === 200) {
        const token = respuesta.token;
  
        if (token) {
          localStorage.setItem('token', token);
        }

        navigate("/home");
      } else {
        alert(respuesta.message);
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

          <button type="submit" className="BotonCancelar">Iniciar sesión</button>
          <button
            type="submit"
            onClick={handleCancelClick}
            className="BotonCancelar"
          >
            Cancelar
          </button>
        </form>
        <div className="imagen">
          <img src={imagen} alt="Imagen" />
        </div>
      </div>
    </>
  );
};

export default Login;

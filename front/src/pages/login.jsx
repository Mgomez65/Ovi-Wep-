import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import imagen1 from '../assets/Login/barrica-vinedos-mendoza-argentina.png'
import imagen2 from '../assets/Login/Racimo-de-uva.png'
import imagen3 from '../assets/Login/viñedos-riego-hombre.png'
import imagen4 from '../assets/Login/viñedos-riego.png'

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
      <h1 className="Titulo-Login">Bienvenido a OVI (Optimización de Viñedos Inteligente)</h1>
      <div className="Info-Login-Conteiner">
        <div className="Info-Conteiner">
          <h2>¡Transforma la Gestión de tus Viñedos!</h2>
          <p>
            En OVI, estamos comprometidos con revolucionar la gestión de viñedos
            a través de soluciones digitales avanzadas. Nuestro objetivo es
            optimizar el cuidado de las plantaciones para mejorar el rendimiento
            de las cosechas y asegurar una producción agrícola de alta calidad.
          </p>
          <h3>¿Por qué Elegir OVI?</h3>
          <ul className="item">
            <li>
              Innovación en la Gestión: Utiliza nuestra herramienta digital
              avanzada para evaluar las condiciones de tus viñedos y recibir
              recomendaciones precisas y personalizadas.
            </li>
            <li>
              Optimización de Recursos: Aprovecha al máximo los recursos
              disponibles con recomendaciones basadas en datos para evitar el
              desperdicio de agua y fertilizantes.
            </li>
            <li>
              Historial de Datos: Mantén un registro detallado de tus datos y
              recomendaciones para realizar un seguimiento efectivo y ajustar
              tus estrategias de manejo.
            </li>
          </ul>
        </div>
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
      </div>
      <div className="Foto-Conteiner">
        <img src={imagen1} alt="Imagen1" className="Imagen"/>
        <img src={imagen2} alt="Imagen1" className="Imagen"/>
        <img src={imagen3} alt="Imagen1" className="Imagen"/>
        <img src={imagen4} alt="Imagen1" className="Imagen"/>
      </div>
      <div className="Info-Conteiner-2">
        <h3>Características Principales:</h3>
        <ul>
          <li>
            Registro y Análisis de Datos: Ingresa datos sobre humedad del suelo,
            temperatura y nutrientes para obtener análisis detallados y
            comprender mejor el estado de tus cultivos.
          </li>
          <li>
            Seguimiento Continuo: Utiliza el historial de datos para monitorizar
            el progreso de tus cultivos y realizar ajustes según sea necesario.
          </li>
        </ul>
        <h3>Nuestro Compromiso:</h3>
        <ul>
          <li>
            Precisión e Innovación: Ofrecemos herramientas precisas para
            maximizar el rendimiento de tus cultivos y apoyar una gestión
            eficiente.
          </li>
          <li>
            Apoyo Continuo: Estamos dedicados a ayudarte y mejorar continuamente
            nuestra aplicación en función de tus necesidades y avances
            tecnológicos.
          </li>
        </ul>
      </div>
    </>
  );
};

export default Login;

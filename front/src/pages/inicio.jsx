import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import imagenInicio from "../assets/Inicio/viejito-Viñedo-compu.png";
import imagenMedio from "../assets/Inicio/persona-con-celular-en-viñedo.jpg";
import Beneficios from "../assets/Inicio/Esquema.png"
import "../styles/inicio.css";

const Inicio = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post(
        "http://localhost:3000/send-email",
        data
      );
      alert("Correo enviado");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un error al enviar el correo");
    }
  };

  return (
    <>
      <div className="containerNavbar">
        <p>
          <a href="#TituloInfo">¿Qué es Ovi?</a>
        </p>
        <p><a href="#Beneficios">Beneficios</a></p>
        <p onClick={handleLoginClick} className="login">
          Login
        </p>
      </div>
      <div className="containerImagenInicio">
        <p>Eficiencia y seguridad para la gestión de tus plantas</p>
        <img src={imagenInicio} alt="Imagen" className="imagenInicio" />
      </div>
      <div className="containerVideo" id="TituloInfo">
        <section className="infoVideo">
          <h2>¿Qué es Ovi?</h2>
          <p>
            OVI (Optimización de Viñedos Inteligente) es una aplicación diseñada
            para ayudar a los viticultores a gestionar y optimizar sus viñedos
            de manera más eficiente y sostenible.
          </p>
        </section>
        <section className="videoInformatico">
          <video src="" controls autoplay muted className="video"></video>
          {/* <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/aucE2EoyoCw?autoplay=1&mute=1"
            title="Video de YouTube"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe> */}
        </section>
      </div>
      <div className="containerImagenMedio">
        <img src={imagenMedio} alt="Imagen" className="imagenMedio" />
      </div>
      <div className="containerBeneficios" id="Beneficios">
        <div className="containerEsquema">
          <p className="textYellow">Beneficios que ofrece</p>
          <p className="TextWhith">la plataforma Ovi</p></div>
        <img src={Beneficios} alt="Beneficios" className="ImagenBeneficios"/>
      </div>
      <div className="containerFormularioConsulta">
        <h2 className="containerTituloForm">Realizá tu consulta.</h2>
        <h3>
          Completá con tus datos y un asesor se comunicará con vos a la brevedad
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="containerDivision">
            <div>
              <label htmlFor="nombre">Nombre:</label>
              <input id="nombre" {...register("nombre", { required: true })} />
              {errors.nombre && <span>El nombre es obligatorio</span>}
            </div>

            <div>
              <label htmlFor="provincia">Provincia:</label>
              <input
                id="provincia"
                {...register("provincia", { required: true })}
              />
              {errors.provincia && <span>LA provincia es obligatoria</span>}
            </div>

            <div>
              <label htmlFor="empresa">Empresa:</label>
              <input
                id="empresa"
                {...register("empresa", { required: true })}
              />
              {errors.empresa && <span>LA empresa es obligatoria</span>}
            </div>

            <div>
              <label htmlFor="telefono">Telefono:</label>
              <input
                id="telefono"
                {...register("telefono", { required: true })}
              />
              {errors.telefono && <span>El telefono es obligatorio</span>}
            </div>

            <div>
              <label htmlFor="cargo">Cargo:</label>
              <input id="cargo" {...register("cargo", { required: true })} />
              {errors.cargo && <span>El cargo es obligatorio</span>}
            </div>

            <div>
              <label htmlFor="correo">Correo electrónico:</label>
              <input
                id="correo"
                type="email"
                {...register("correo", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Formato de correo inválido",
                  },
                })}
              />
              {errors.correo && <span>El correo es obligatorio</span>}
            </div>
          </div>

          <div className="comentarioFormConsulta">
            <label htmlFor="comentario">Comentario:</label>
            <input id="comentario" {...register("comentario")} />
            {errors.comentario}
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
};

export default Inicio;

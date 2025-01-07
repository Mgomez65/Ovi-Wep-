import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import imagenInicio from "../../assets/Inicio/Viejito-Viñedo-compu.png";
import imagenMedio from "../../assets/Inicio/persona-con-celular-en-viñedo.jpg";
import Beneficios from "../../assets/Inicio/Esquema.png"
import "./inicio.css";

const Inicio = () => {
  const navigate = useNavigate();

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_d01hgce', 'template_9xg1ucb', form.current, {
        publicKey: 'YF2vquWpC4ecsHR6w',
      })
      .then(
        () => {
          console.log('¡ENVIO CORRECTO!');
        },
        (error) => {
          console.log('FALLO...', error.text);
        },
      );
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <main className="containerInicio">
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
          <video src="/Ovi-Video-Inicio.mp4" controls muted className="video"></video>
        </section>
      </div>
      <div className="containerImagenMedio">
        <img src={imagenMedio} alt="Imagen" className="imagenMedio" />
      </div>
      <div className="containerBeneficios" id="Beneficios">
        <div className="containerEsquema">
          <p className="textYellow">Beneficios que ofrece</p>
          <p className="textWhith">la plataforma Ovi</p></div>
        <img src={Beneficios} alt="Beneficios" className="ImagenBeneficios"/>
      </div>
      <div className="containerFormularioConsulta">
        <h2 className="containerTituloForm">Realizá tu consulta.</h2>
        <h3>
          Completá con tus datos y un asesor se comunicará con vos a la brevedad
        </h3>

        <form ref={form} onSubmit={sendEmail}>
          <div className="containerDivision">
            <div>
              <label htmlFor="nombre">Nombre:</label>
              <input
                id="nombre"
                type="text"
                name="user_name"
                placeholder='Tu nombre...'
              />
              {errors.nombre && <span>El nombre es obligatorio</span>}
            </div>

            <div>
              <label htmlFor="provincia">Provincia:</label>
              <input
                id="provincia"
                name="message"
                placeholder='Tu provincia...'
              />
              {errors.provincia && <span>LA provincia es obligatoria</span>}
            </div>

            <div>
              <label htmlFor="empresa">Empresa:</label>
              <input
                id="empresa"
                name="message"
                placeholder='Tu empresa...'
              />
              {errors.empresa && <span>LA empresa es obligatoria</span>}
            </div>

            <div>
              <label htmlFor="telefono">Telefono:</label>
              <input
                id="telefono"
                name="message"
                placeholder='Tu telefono...'
              />
              {errors.telefono && <span>El telefono es obligatorio</span>}
            </div>

            <div>
              <label htmlFor="cargo">Cargo:</label>
              <input
                id="cargo"
                name="message"
                placeholder='Tu cargo...'
              />
              {errors.cargo && <span>El cargo es obligatorio</span>}
            </div>

            <div>
              <label htmlFor="correo">Correo electrónico:</label>
              <input
                id="correo"
                type="email"
                name="user_email"
                placeholder='Tu correo...'
              />
              {errors.correo && <span>El correo es obligatorio</span>}
            </div>
          </div>

          <div className="comentarioFormConsulta">
            <label htmlFor="comentario">Comentario:</label>
            <input id="comentario" name="message" placeholder='Tu mensaje...'/>
            {errors.comentario}
          </div>

          <button type="submit" value="Send">Enviar</button>
        </form>
      </div>
    </main>
  );
};

export default Inicio;

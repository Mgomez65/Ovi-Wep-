import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import imagenInicio from "../assets/Inicio/Vitivinicola.jpg"
import imagenMedio from "../assets/Inicio/mano.png"

const Inicio = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const response = await axios.post('http://localhost:3000/send-email', data);
      alert('Correo enviado');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Hubo un error al enviar el correo');
    }
  };

  return (
    <>
      <div className="containerImagenInicio" style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={imagenInicio} alt="Imagen" style={{ height: '450px' }}/>
      </div>
      <div className="containerVideo">
        <section className="infoVideo">Info</section>
        <section className="videoInformatico">
          <video src="" controls autoplay muted></video>
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
        <img src={imagenMedio} alt="Imagen" style={{ width: '100%' }}/>
      </div>
      <div className="containerEsquema">Esquema</div>
      <div className="containerFormularioConsulta" style={{ width: '99.3%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <input id="empresa" {...register("empresa", { required: true })} />
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

          <div>
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

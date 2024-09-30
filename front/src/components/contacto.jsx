import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export const ContactUs = () => {
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

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
    </form>
  );
};
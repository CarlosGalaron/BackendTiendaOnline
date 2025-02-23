// utils/generarLlave.js
const generarLlave = (longitud = 20) => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let llave = '';
    for (let i = 0; i < longitud; i++) {
      llave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return llave;
  };
  
  module.exports = generarLlave;
  
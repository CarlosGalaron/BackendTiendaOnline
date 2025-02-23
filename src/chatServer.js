const sequelize = require("./config/db"); // Importa sequelize
const fs = require("fs"); // Importa fs para verificar archivos
const generarLlave = require("./utils/generarLlave");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔵 Un usuario se ha conectado:", socket.id);

    // Función para verificar si el archivo ha caducado
    const verificarArchivoCaducado = (filePath) => {
      if (!fs.existsSync(filePath)) {
        return true; // Si el archivo no existe, se considera caducado
      }
      const fileStats = fs.statSync(filePath);
      const ahora = Date.now();
      const edadArchivo = ahora - fileStats.mtimeMs;
      const tiempoCaducidad = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      return edadArchivo > tiempoCaducidad;
    };

    // Función para verificar si un numRoom ya existe en la tabla "chats"
    const existeChat = async (numRoom) => {
      const query = `SELECT 1 FROM chats WHERE numRoom = ? LIMIT 1`;
      const resultado = await sequelize.query(query, {
        replacements: [numRoom],
        type: sequelize.QueryTypes.SELECT
      });
      return resultado.length > 0;
    };

    // Función para generar una llave única (numRoom) comprobando que no exista en la DB
    const generarLlaveUnica = async (longitud = 20) => {
      let llave;
      let existe = true;
      do {
        llave = generarLlave(longitud);
        existe = await existeChat(llave);
      } while (existe);

      if (!llave) {
        throw new Error("No se pudo generar una llave única.");
      }

      return llave;
    };

    // Evento para unirse a una sala de chat
    socket.on("join_room", async ({ room, user1_id, user2_id }) => {
      try {
        // Si no se proporciona un room, se genera uno único
        if (!room) {
          room = await generarLlaveUnica();
        }

        // Verificar que room tenga un valor
        if (!room) {
          console.error("❌ Error: No se pudo generar un room válido.");
          return;
        }

        console.log(`Room generado/recibido: ${room}`);
        console.log(`🟢 Usuario se unió a la sala ${room}`);
        socket.join(room);

        // Verificar si la sala ya existe en la base de datos
        const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
        const results = await sequelize.query(query, {
          replacements: [room],
          type: sequelize.QueryTypes.SELECT
        });

        let historial = results.length ? JSON.parse(results[0].mensajes) : [];

        // Si la sala no existe en la DB, se crea (solo si se proporcionan user1_id y user2_id)
        if (!results.length && user1_id && user2_id) {
          await sequelize.query(
            `INSERT INTO chats (numRoom, user1_id, user2_id, mensajes) VALUES (?, ?, ?, ?)`,
            { replacements: [room, user1_id, user2_id, JSON.stringify([])] }
          );
          console.log(`✅ Sala ${room} creada en DB.`);
        }

        // Verificar si los archivos del historial han caducado
        historial = historial.map((mensaje) => {
          if (mensaje.archivo && mensaje.nombreArchivo) {
            const filePath = `./uploads/${mensaje.nombreArchivo}`;
            if (verificarArchivoCaducado(filePath)) {
              mensaje.texto = "Archivo caducado"; // Se reemplaza el texto
              mensaje.archivo = null; // No se envía el archivo
            }
          }
          return mensaje;
        });

        socket.emit("chat_history", historial);
      } catch (err) {
        console.error("❌ Error en join_room:", err);
        socket.emit("chat_error", "Error al unirse a la sala.");
      }
    });

    // Evento para enviar un mensaje de texto
    socket.on("chat_message", async ({ room, usuario, texto }) => {
      try {
        console.log(`💬 Mensaje en sala ${room} de ${usuario}: ${texto}`);

        const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
        const results = await sequelize.query(query, {
          replacements: [room],
          type: sequelize.QueryTypes.SELECT
        });

        let historial = results.length ? JSON.parse(results[0].mensajes) : [];
        historial.push({ usuario, texto });

        await sequelize.query(
          `UPDATE chats SET mensajes = ? WHERE numRoom = ?`,
          { replacements: [JSON.stringify(historial), room] }
        );

        io.to(room).emit("chat_message", { usuario, texto });
      } catch (err) {
        console.error("❌ Error en chat_message:", err);
        socket.emit("chat_error", "Error al enviar el mensaje.");
      }
    });

    // Evento para enviar un archivo
    socket.on("chat_file", async ({ room, usuario, archivo, nombreArchivo, tipoArchivo }) => {
      try {
        console.log(`💾 Archivo recibido en sala ${room} de ${usuario}: ${nombreArchivo}`);

        io.to(room).emit("chat_file", {
          usuario,
          archivo,
          nombreArchivo,
          tipoArchivo
        });

        const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
        const results = await sequelize.query(query, {
          replacements: [room],
          type: sequelize.QueryTypes.SELECT
        });

        let historial = results.length ? JSON.parse(results[0].mensajes) : [];
        historial.push({
          usuario,
          texto: "Archivo caducado", // Ajustar según convenga
          archivo: null,
          nombreArchivo,
          tipoArchivo
        });

        await sequelize.query(
          `UPDATE chats SET mensajes = ? WHERE numRoom = ?`,
          { replacements: [JSON.stringify(historial), room] }
        );

        console.log("✅ Mensaje de archivo almacenado en la base de datos.");
      } catch (err) {
        console.error("❌ Error en chat_file:", err);
        socket.emit("chat_error", "Error al enviar el archivo.");
      }
    });

    // Evento para desconectar un usuario
    socket.on("disconnect", () => {
      console.log("🔴 Un usuario se ha desconectado:", socket.id);
    });

    // Evento para obtener los chats de un usuario
    socket.on("get_user_chats", async (usuarioId) => {
      try {
        console.log(`🟢 Obteniendo chats para el usuario: ${usuarioId}`);
        const query = `SELECT numRoom, mensajes FROM chats WHERE user1_id = ? OR user2_id = ?`;
        const chats = await sequelize.query(query, {
          replacements: [usuarioId, usuarioId],
          type: sequelize.QueryTypes.SELECT
        });
        socket.emit("user_chats", chats);
      } catch (error) {
        console.error("❌ Error al obtener los chats del usuario:", error);
        socket.emit("chat_error", "Error al obtener los chats.");
      }
    });
  });
};
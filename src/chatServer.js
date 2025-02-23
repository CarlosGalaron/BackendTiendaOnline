const sequelize = require("./config/db"); // Importa sequelize
const fs = require("fs");  // Importar fs para verificar archivos

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔵 Un usuario se ha conectado:", socket.id);

    // Función para verificar si el archivo ha caducado
    const verificarArchivoCaducado = (filePath) => {
      if (!fs.existsSync(filePath)) {
        return true;  // Si el archivo no existe, ha caducado
      }

      // Lógica de caducidad (por ejemplo, si el archivo tiene más de 24 horas)
      const fileStats = fs.statSync(filePath);
      const now = Date.now();
      const fileAge = now - fileStats.mtimeMs;
      const expiryTime = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

      return fileAge > expiryTime;
    };

    socket.on("join_room", ({ room, usuario }) => {
      console.log(`🟢 Usuario ${usuario} se unió a la sala ${room}`);
      socket.join(room);

      const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
      sequelize.query(query, { replacements: [room], type: sequelize.QueryTypes.SELECT })
        .then((results) => {
          let historial = results.length ? JSON.parse(results[0].mensajes) : [];

          // Si la sala no existe en la DB, la creamos
          if (!results.length) {
            sequelize.query(
              `INSERT INTO chats (numRoom, mensajes) VALUES (?, ?)`,
              { replacements: [room, JSON.stringify([])] }
            )
              .then(() => {
                console.log(`✅ Sala ${room} creada en DB.`);
              })
              .catch((err) => {
                console.error("❌ Error al crear la sala:", err);
              });
          }

          // Al cargar el historial, verificamos si los archivos han caducado
          historial = historial.map(mensaje => {
            if (mensaje.archivo && mensaje.nombreArchivo) {
              const filePath = `./uploads/${mensaje.nombreArchivo}`;
              if (verificarArchivoCaducado(filePath)) {
                mensaje.texto = "Archivo caducado"; // Reemplazamos el texto si el archivo caducó
                mensaje.archivo = null;  // No enviamos el archivo
              }
            }
            return mensaje;
          });

          socket.emit("chat_history", historial);
        })
        .catch((err) => {
          console.error("❌ Error al cargar historial:", err);
        });
    });

    socket.on("chat_message", ({ room, usuario, texto }) => {
      console.log(`💬 Mensaje en sala ${room} de ${usuario}: ${texto}`);

      const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
      sequelize.query(query, { replacements: [room], type: sequelize.QueryTypes.SELECT })
        .then((results) => {
          let historial = results.length ? JSON.parse(results[0].mensajes) : [];
          historial.push({ usuario, texto });

          sequelize.query(
            `UPDATE chats SET mensajes = ? WHERE numRoom = ?`,
            { replacements: [JSON.stringify(historial), room] }
          )
            .then(() => {
              io.to(room).emit("chat_message", { usuario, texto });
            })
            .catch((err) => {
              console.error("❌ Error al actualizar mensaje:", err);
            });
        })
        .catch((err) => {
          console.error("❌ Error al cargar historial:", err);
        });
    });

    socket.on("chat_file", ({ room, usuario, archivo, nombreArchivo, tipoArchivo }) => {
      console.log(`💾 Archivo recibido en sala ${room} de ${usuario}: ${nombreArchivo}`);

      // Emitir el archivo a todos los miembros de la sala
      io.to(room).emit("chat_file", {
        usuario,
        archivo,
        nombreArchivo,
        tipoArchivo
      });

      const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
      sequelize.query(query, { replacements: [room], type: sequelize.QueryTypes.SELECT })
        .then((results) => {
          let historial = results.length ? JSON.parse(results[0].mensajes) : [];
          
          historial.push({
            usuario,
            texto: "Archivo caducado", // Ajustar este mensaje según convenga
            archivo: null,  // No se guarda el archivo en la DB
            nombreArchivo,
            tipoArchivo
          });

          sequelize.query(
            `UPDATE chats SET mensajes = ? WHERE numRoom = ?`,
            { replacements: [JSON.stringify(historial), room] }
          )
            .then(() => {
              console.log("✅ Mensaje de archivo almacenado en la base de datos.");
            })
            .catch((err) => {
              console.error("❌ Error al actualizar historial de archivo:", err);
            });
        })
        .catch((err) => {
          console.error("❌ Error al cargar historial para archivo:", err);
        });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Un usuario se ha desconectado:", socket.id);
    });

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

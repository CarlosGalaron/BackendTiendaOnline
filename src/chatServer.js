const sequelize = require("./config/db"); // Importa sequelize

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔵 Un usuario se ha conectado:", socket.id);

    socket.on("join_room", ({ room, usuario }) => {
      console.log(`🟢 Usuario ${usuario} se unió a la sala ${room}`);
      socket.join(room);

      const query = `SELECT mensajes FROM chats WHERE numRoom = ?`;
      sequelize.query(query, { replacements: [room], type: sequelize.QueryTypes.SELECT })
        .then((results) => {
          let historial = results.length ? JSON.parse(results[0].mensajes) : [];
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

    socket.on("disconnect", () => {
      console.log("🔴 Un usuario se ha desconectado:", socket.id);
    });
  });
};
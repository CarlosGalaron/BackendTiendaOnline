const app = require('./src/app');
const sequelize = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true }) // Sincroniza los modelos con la base de datos
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Failed to start server:', err));

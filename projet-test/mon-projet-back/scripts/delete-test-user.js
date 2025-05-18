const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false
});

async function deleteUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    await User.destroy({
      where: {
        email: 'test@example.com'
      }
    });

    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

deleteUser();

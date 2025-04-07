// Crea un archivo migrations/remove-ventas-id-from-cliente.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('cliente', 'ventas_idventas');
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('cliente', 'ventas_idventas', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ventas',
          key: 'idventas'
        }
      });
    }
  };
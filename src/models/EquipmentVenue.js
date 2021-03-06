const { Model, DataTypes } = require('sequelize');

class EquipmentVenue extends Model {
    static init(sequelize) {
        super.init({
            venue_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            equipment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'equipment_venues'
        })
    }
    static associate(models){
        this.belongsTo(models.Equipment, { foreignKey: 'equipment_id', as: 'equipments' })
    }

}

module.exports = EquipmentVenue;
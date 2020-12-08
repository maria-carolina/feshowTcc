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
        this.belongsToMany(models.Equipment, { foreignKey: 'venue_id', through: 'equipment_venues', as: 'equipments'});
        this.belongsToMany(models.Artist, { foreignKey: 'equipment_id', through: 'equipment_venues', as: 'equipmentVenues'});
    }

}

module.exports = EquipmentVenue;
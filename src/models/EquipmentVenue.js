const { Model, DataTypes } = require('sequelize');

class EquipmentVenue extends Model {
    static init(sequelize) {
        super.init({
            venue_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            equipment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'equipment_venues'
        })
    }
    static associate(models){
        //
    }

}

module.exports = EquipmentVenue;
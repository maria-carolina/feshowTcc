const { Model, DataTypes } = require('sequelize');

class Equipment extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'equipments'
        })
    }
    static associate(models){
       this.hasMany(models.EquipmentVenue, { foreignKey: 'equipment_id', as: 'equipments' });
    }

}

module.exports = Equipment;
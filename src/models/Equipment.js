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
        //
    }

}

module.exports = Equipment;
const { Model, DataTypes } = require('sequelize');

class Instrument extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'instruments'
        })
    }
    static associate(models){
        //
    }

}

module.exports = Instrument;
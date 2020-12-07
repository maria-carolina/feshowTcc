const { Model, DataTypes } = require('sequelize');

class Rider extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'riders'
        })
    }
    static associate(models){
        //
    }

}

module.exports = Rider;
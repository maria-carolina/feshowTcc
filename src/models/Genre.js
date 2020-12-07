const { Model, DataTypes } = require('sequelize');

class Genres extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'genres'
        })
    }
    static associate(models){
        //
    }

}

module.exports = Genres;
const { Model, DataTypes } = require('sequelize');

class GenreVenue extends Model {
    static init(sequelize) {
        super.init({
            venue_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'genre_venues'
        })
    }
    static associate(models){
        //
    }

}

module.exports = GenreVenue;
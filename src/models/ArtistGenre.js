const { Model, DataTypes } = require('sequelize');

class ArtistGenre extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'artist_genres'
        })
    }
    static associate(models){
        //
    }

}

module.exports = ArtistGenre;
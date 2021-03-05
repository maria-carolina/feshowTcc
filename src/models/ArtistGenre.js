const { Model, DataTypes } = require('sequelize');

class ArtistGenre extends Model {
    static init(sequelize) {
        super.init({
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
        },{
            sequelize,
            tableName: 'artist_genres'
        })
    }
    static associate(models){
        this.belongsToMany(models.Genre, { foreignKey: 'artist_id', through: 'artist_genres', as: 'genres' });
        this.belongsToMany(models.Artist, { foreignKey: 'genre_id', through: 'artist_genres', as: 'artists' });
    }

}

module.exports = ArtistGenre;
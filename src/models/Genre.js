const { Model, DataTypes } = require('sequelize');

class Genre extends Model {
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
        this.belongsToMany(models.Artist, { foreignKey: 'genre_id', through: 'artist_genres', as: 'generosArtistas' });
        this.belongsToMany(models.Venue, { foreignKey: 'genre_id', through: 'genre_venues', as: 'generosEspaco' });
    }

}

module.exports = Genre;
const { Model, DataTypes } = require('sequelize');

class GenreVenues extends Model {
    static init(sequelize) {
        super.init({
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            venue_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
        },{
            sequelize,
            tableName: 'genre_venues'
        })
    }
    static associate(models){
        this.belongsToMany(models.Genre, { foreignKey: 'venue_id', through: 'genre_venues', as: 'genres' });
        this.belongsToMany(models.Venue, { foreignKey: 'genre_id', through: 'genre_venues', as: 'venues' });
  
    }

}

module.exports = GenreVenues;
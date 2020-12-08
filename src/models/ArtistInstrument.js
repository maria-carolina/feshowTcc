const { Model, DataTypes } = require('sequelize');

class ArtistInstrument extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            instrument_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            
        },{
            sequelize,
            tableName: 'artist_instruments'
        })
    }
    static associate(models){
        this.belongsToMany(models.Instrument, { foreignKey: 'artist_id', through: 'artist_instruments', as: 'instruments' });
        this.belongsToMany(models.Artist, { foreignKey: 'instrument_id', through: 'artist_instruments', as: 'instrumentsArtist' });
    }

}

module.exports = ArtistInstrument;
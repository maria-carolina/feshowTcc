const { Model, DataTypes } = require('sequelize');

class ArtistInstrument extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            instrument_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            
        },{
            sequelize,
            tableName: 'artist_instruments'
        })
    }
    static associate(models){
        //
    }

}

module.exports = ArtistInstrument;
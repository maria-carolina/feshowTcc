const { Model, DataTypes } = require('sequelize');

class ArtistEvent extends Model {
    static init(sequelize) {
        super.init({
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            start_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },{
            sequelize,
            timestamps: true,
            tableName: 'artist_events'
        })
    }
    static associate(models){
        //
    }

}

module.exports = ArtistEvent;
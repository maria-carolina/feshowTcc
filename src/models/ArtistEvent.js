const { Model, DataTypes } = require('sequelize');

class ArtistEvent extends Model {
    static init(sequelize) {
        super.init({
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
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
        this.belongsTo(models.Artist, { foreignKey: 'artist_id', as: 'artists' })
    }

}

module.exports = ArtistEvent;
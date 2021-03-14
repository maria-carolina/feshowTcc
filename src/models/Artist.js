const { Model, DataTypes } = require('sequelize');

class Artist extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo nome não pode ser vazio'
                    }
                }
            },
            members: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cache: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },{
            sequelize,
            tableName: 'artists'
        })
    }
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsToMany(models.Genre, { foreignKey: 'artist_id', through: 'artist_genres', as: 'genres' });
        this.hasMany(models.ArtistEvent, { foreignKey: 'artist_id', as: 'events' })
        this.belongsToMany(models.Instrument, { foreignKey: 'artist_id', through: 'artist_instruments', as: 'instruments' });
    }

}

module.exports = Artist;
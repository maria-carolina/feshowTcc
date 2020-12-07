const { Model, DataTypes } = require('sequelize');

class Venue extends Model {
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
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            opening_time: {
                type: DataTypes.STRING,
                allowNull: true
            },
            closing_time: {
                type: DataTypes.STRING,
                allowNull: true
            },
            first_day: {
                type: DataTypes.STRING,
                allowNull: true
            },
            last_day: {
                type: DataTypes.STRING,
                allowNull: true
            },
            capacity: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo capacidade não pode ser vazio'
                    }
                }
            }
        }, {
            sequelize,
            tableName: 'venues'
        })
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsToMany(models.Genre, { foreignKey: 'venue_id', through: 'genre_venues', as: 'genres' });
    }

}

module.exports = Venue;
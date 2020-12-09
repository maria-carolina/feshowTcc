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
            initialHour: {
                type: DataTypes.TIME,
                allowNull: true
            },
            finalHour: {
                type: DataTypes.TIME,
                allowNull: true
            },
            initialDay: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            finalDay: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            capacity: {
                type: DataTypes.INTEGER,
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
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsToMany(models.Genre, { foreignKey: 'venue_id', through: 'genre_venues', as: 'genres' });
    }

}

module.exports = Venue;
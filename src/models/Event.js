const { Model, DataTypes } = require('sequelize');

class Event extends Model {
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
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo data de início não pode ser vazio'
                    }
                }
            },
            start_time: {
                type: DataTypes.TIME,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo de horário inicial não pode ser vazio'
                    }
                }
            },
            end_time: {
                type: DataTypes.TIME,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo de horário final não pode ser vazio'
                    }
                }
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
        }, {
            sequelize,
            timestamps: true,
            tableName: 'events'
        })
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'organizer_id', as: 'organizer' });
        this.belongsTo(models.Venue, { foreignKey: 'venue_id', as: 'venue' });
        this.hasMany(models.ArtistEvent, { foreignKey: 'event_id', as: 'invitations' });
    }

}

module.exports = Event;
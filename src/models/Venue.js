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
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo descrição não pode ser vazio'
                    }
                }
            },
            opening_time: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo de horário de abertura não pode ser vazio'
                    }
                }
            },
            closing_time: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo de horário de fechamento não pode ser vazio'
                    }
                }
            },
            first_day: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo de primeiro dia de abertura não pode ser vazio'
                    }
                }
            },
            last_day: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo de último dia de abertura não pode ser vazio'
                    }
                }
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
    }

}

module.exports = Venue;
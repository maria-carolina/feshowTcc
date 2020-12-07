const { Model, DataTypes } = require('sequelize');

class Solicitation extends Model {
    static init(sequelize) {
        super.init({
            description: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo descrição não pode ser vazio'
                    }
                }
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo data de início não pode ser vazio'
                    }
                }
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo data final não pode ser vazio'
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
            tableName: 'solicitations'
        })
    }
    static associate(models) {
        //
    }

}

module.exports = Solicitation;
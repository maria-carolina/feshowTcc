const { Model, DataTypes } = require('sequelize');

class Producer extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.INTEGER,
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
            chat_permission: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
        }, {
            sequelize,
            tableName: 'producers'
        })
    }
    static associate(models) {
        //
    }

}

module.exports = Producer;
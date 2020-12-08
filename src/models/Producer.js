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
                allowNull: true,
            },
            chat_permission: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            city: {
                type: DataTypes.STRING,
            }
        }, {
            sequelize,
            tableName: 'producers'
        })
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }

}

module.exports = Producer;
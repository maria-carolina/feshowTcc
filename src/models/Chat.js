const { Model, DataTypes } = require('sequelize');

class Chat extends Model {
    static init(sequelize) {
        super.init({
            sender: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            receiver: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
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
            tableName: 'chats'
        })
    }
    static associate(models) {
        //
    }

}

module.exports = Chat;
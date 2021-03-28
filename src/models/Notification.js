const { Model, DataTypes } = require('sequelize');

/*
    status
    0 - nada
    1 - abrir convites
    2 - abrir eventos
*/

class Notification extends Model {
    static init(sequelize) {
        super.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            auxiliary_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            new: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
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
            tableName: 'notifications'
        })
    }
    static associate(models) {
        
    }

}

module.exports = Notification;
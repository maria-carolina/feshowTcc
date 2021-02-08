const { Model, DataTypes } = require('sequelize');

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
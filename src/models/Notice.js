const { Model, DataTypes } = require('sequelize');

class Notice extends Model {
    static init(sequelize) {
        super.init({
            text: {
                type: DataTypes.STRING,
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

        },{
            sequelize,
            timestamps: true,
            tableName: 'notices'
        })
    }
    static associate(models){
        //
    }

}

module.exports = Notice;
const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({   
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                 type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'users'
        })
    }
    static associate(models){
       //
    }

}

module.exports = User;
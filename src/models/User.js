const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

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
            image: {
                type: DataTypes.STRING,
                allowNull: true,
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
            hooks: {
                beforeCreate:(async (user) => {
                    const hash = await bcrypt.hash(user.password, 10)
                    user.password = hash;
                  })
              },
            sequelize,
            tableName: 'users'
        })
    }
    static associate(models){
       //
    }

}

module.exports = User;
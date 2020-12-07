const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({   
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Email address already in use!'
                }
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
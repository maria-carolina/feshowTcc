const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Este Campo não pode ser vazio'
                    }
                }
            },
            email:{
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Este campo não pode ser vazio'
                    },
                    isEmail: {
                        msg: 'Preencha com um e-mail válido'
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Este campo não pode ser vazio'
                    },
                    len: {
                        args: [6, 10],
                        msg: 'Este campo deve ter entre 6 e 10 caracteres'
                    }
                }   
            },
            type: DataTypes.INTEGER
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
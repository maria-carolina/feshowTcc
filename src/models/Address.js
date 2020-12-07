const { Model, DataTypes } = require('sequelize');

class Address extends Model {
    static init(sequelize) {
        super.init({
            venue_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            zipcode: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo CEP não pode ser vazio'
                    }
                }
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo logradouro não pode ser vazio'
                    }
                }
            },
            district: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo bairro não pode ser vazio'
                    }
                }
            },
            number: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo número não pode ser vazio'
                    }
                }
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo cidade não pode ser vazio'
                    }
                }
            },
            uf: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo estado não pode ser vazio'
                    }
                }
            }
        }, {
            sequelize,
            tableName: 'addresses'
        })
    }
    static associate(models) {
        //
    }

}

module.exports = Address;
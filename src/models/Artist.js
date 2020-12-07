const { Model, DataTypes } = require('sequelize');

class Artist extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O campo nome não pode ser vazio'
                    }
                }
            },
            members: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cache: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            city: {
                type: DataTypes.FLOAT,
                allowNull: true
            }
        },{
            sequelize,
            tableName: 'artists'
        })
    }
    static associate(models){
        //
    }

}

module.exports = Artist;
const { Model, DataTypes } = require('sequelize');

class Equipment extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'equipments'
        })
    }
    static associate(models){
        this.belongsToMany(models.Artist, { foreignKey: 'equipment_id', through: 'artist_equipments', as: 'equipments' });
    }

}

module.exports = Equipment;
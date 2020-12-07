const { Model, DataTypes } = require('sequelize');

class Rider extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            sequelize,
            tableName: 'riders'
        })
    }
    static associate(models){
        this.belongsTo(models.Artist, { foreignKey: 'artist_id', as: 'artist' })
    }

}

module.exports = Rider;
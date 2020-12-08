const { Model, DataTypes } = require('sequelize');

class ArtistEquipment extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            equipment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },{
            sequelize,
            tableName: 'artist_equipments'
        })
    }
    static associate(models){
        this.belongsToMany(models.Equipment, { foreignKey: 'artist_id', through: 'artist_equipments', as: 'equipments' });
        this.belongsToMany(models.Artist, { foreignKey: 'equipment_id', through: 'artist_equipments', as: 'equipmentArtist' });
    }

}

module.exports = ArtistEquipment;
const { Model, DataTypes } = require('sequelize');

class ArtistEquipment extends Model {
    static init(sequelize) {
        super.init({
            artist_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            equipment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },{
            sequelize,
            tableName: 'artist_equipments'
        })
    }
    static associate(models){
        //
    }

}

module.exports = ArtistEquipment;
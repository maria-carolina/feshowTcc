const { Model, DataTypes } = require('sequelize');

class EventImage extends Model {
    static init(sequelize) {
        super.init({
            event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },{
            sequelize,
            tableName: 'event_images'
        })
    }
    static associate(models){
        this.belongsTo(models.Event, { foreignKey: 'event_id', as: 'imageEvent' })
    }

}

module.exports = EventImage;
const { Model, DataTypes } = require('sequelize');

class ImageUser extends Model {
    static init(sequelize) {
        super.init({
            user_id: {
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
            tableName: 'image_users'
        })
    }
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'imageUser' })
    }

}

module.exports = ImageUser;
const { Model, DataTypes } = require('sequelize');

class Post extends Model {
    static init(sequelize) {
        super.init({
            post: {
                type: DataTypes.STRING,
                allowNull: false
            },
            data: {
                type: DataTypes.DATE,
                allowNull: false
            },
            time: {
                type: DataTypes.TIME,
                allowNull: false
            },
        },{
            sequelize,
            tableName: 'posts'
        })
    }
    static associate(models){
        //
    }

}

module.exports = Post;
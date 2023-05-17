"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Likes, {
        sourceKey: "postId",
        foreignKey: "PostId",
      });
      this.hasMany(models.Comments, {
        sourceKey: "postId",
        foreignKey: "PostId",
      });
      this.belongsTo(models.Users, {
        targetKey: "userId",
        foreignKey: "UserId",
      });
    }
  }
  Posts.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      postPhoto: {
        type: Sequelize.STRING,
        defaultValue:
          "https://outstagrams.s3.ap-northeast-2.amazonaws.com/folder/2023-5-13-14-5-58_7535",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    },
    {
      sequelize,
      modelName: "Posts",
    },
  );
  return Posts;
};

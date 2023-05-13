"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.Users, {
        targetKey: "userId",
        foreignKey: "UserId",
      });
      this.belongsTo(models.Posts, {
        targetKey: "postId",
        foreignKey: "PostId",
      });
    }
  }
  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.NUMBER,
        references: {
          model: "users",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      PostId: {
        allowNull: false,
        type: Sequelize.NUMBER,
        references: {
          model: "posts",
          key: "postId",
        },
        onDelete: "CASCADE",
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
      modelName: "Likes",
    }
  );
  return Likes;
};

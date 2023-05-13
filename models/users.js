"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.Posts, {
        sourceKey: "userid",
        foreignKey: "UserId",
      });
      this.hasMany(models.Comments, {
        sourceKey: "userid",
        foreignKey: "UserId",
      });
      this.hasMany(models.Likes, {
        sourceKey: "userid",
        foreignKey: "UserId",
      });
      this.hasMany(models.Follows, {
        sourceKey: "userid",
        foreignKey: "UserId",
      });
      this.hasMany(models.Follows, {
        sourceKey: "userid",
        foreignKey: "followUserId",
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userPhoto: {
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
      modelName: "Users",
    },
  );
  return Users;
};

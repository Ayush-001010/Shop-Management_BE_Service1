import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ChatGroup = sequelize.define("ChatGroupTable", {
    ID: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    GroupName: DataTypes.STRING,
    GroupID: DataTypes.STRING,
    UserID: DataTypes.STRING,
    GroupCreateBy: DataTypes.STRING,
    GroupImageURL: DataTypes.STRING,
    GroupAbout: DataTypes.STRING
});

export default ChatGroup;
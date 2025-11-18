import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ChatMessage = sequelize.define("ChatMessageTable", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Message: DataTypes.STRING,
    SendBy: DataTypes.STRING,
    RecivedBy: DataTypes.STRING,
    SendByName: DataTypes.STRING,
    RecivedByName: DataTypes.STRING,
    GroupID: DataTypes.STRING,
    IsMessageNotSend: DataTypes.BOOLEAN,
    DeletedBy: DataTypes.STRING,
    ReplyChatID: DataTypes.STRING,
    FileURL: DataTypes.STRING,
    isLinkMessage : DataTypes.BOOLEAN
});

export default ChatMessage;
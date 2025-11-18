import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const PinnedChat = sequelize.define("PinnedChatTable" , {
    ID : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    PersonPingID : DataTypes.INTEGER,
    GroupPingID : DataTypes.INTEGER,
    UserID : DataTypes.INTEGER
});

export default PinnedChat;
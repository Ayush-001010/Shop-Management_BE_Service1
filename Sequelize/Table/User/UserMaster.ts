import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const UserMaster = sequelize.define("usermastertable", {
    ID: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin : DataTypes.BOOLEAN,
    userImageURL : DataTypes.STRING,
    About : DataTypes.STRING
});

export default UserMaster;
import sequelize from "../dbConfig";
import { DataTypes } from "sequelize";

const CityMaster = sequelize.define("CityMasterTable", {
    ID: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    City: DataTypes.STRING,
    State: DataTypes.STRING
});

export default CityMaster;
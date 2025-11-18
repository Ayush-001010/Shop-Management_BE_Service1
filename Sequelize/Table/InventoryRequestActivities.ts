import sequelize from "../dbConfig";
import { DataTypes } from "sequelize";

const InventoryRequestActivities = sequelize.define("InventoryRequestActivitiesTable", {
    ID : {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    Activity:DataTypes.STRING
});

export default InventoryRequestActivities;
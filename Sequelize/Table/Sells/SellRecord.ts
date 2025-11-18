import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const SellRecords = sequelize.define("SellRecordsTable", {
    ID: {
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ProductName: DataTypes.STRING,
    ProductType: DataTypes.STRING,
    Quantity: DataTypes.INTEGER,
    Cost: DataTypes.INTEGER,
    Profit: DataTypes.INTEGER,
});

export default SellRecords;
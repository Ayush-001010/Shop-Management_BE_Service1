import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ItemSchema = sequelize.define("ItemSchemaTable", {
    ID: {
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    ItemUIType: DataTypes.ENUM("Style 1", "Style 2", "Style 3", "Style 4"),
});

export default ItemSchema;
import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ShopNotes = sequelize.define('ShopNotesTable', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Note: DataTypes.STRING
});

export default ShopNotes;
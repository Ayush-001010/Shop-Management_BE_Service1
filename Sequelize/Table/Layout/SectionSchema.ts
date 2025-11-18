import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const SectionSchema = sequelize.define("SectionSchemaTable", {
    ID: {
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    SectionType: DataTypes.ENUM("Banner", "Category", "Sub-Category", "Category-Items", "Items"),
    ImageURLs: DataTypes.STRING,
    RedirectLink: DataTypes.STRING,
    CategoryItems: DataTypes.STRING,
    Category: DataTypes.STRING,
    SubCategory: DataTypes.STRING,
    Discount: DataTypes.STRING,
    CategoryUIType: DataTypes.ENUM("Circular", "Rectangular"),
    SerialNumber : DataTypes.INTEGER
});

export default SectionSchema;
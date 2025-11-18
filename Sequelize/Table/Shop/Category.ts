import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const Category = sequelize.define("CategoryTable", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Type: DataTypes.STRING,
    SubType: DataTypes.STRING,
    CategoryImageURL: DataTypes.STRING
})

export default Category;
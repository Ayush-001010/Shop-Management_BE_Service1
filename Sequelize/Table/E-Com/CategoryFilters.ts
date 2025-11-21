import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const CategoryFilters = sequelize.define("CategoryFiltersTable", {
    ID: {
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    Type: DataTypes.STRING,
    Filters: DataTypes.STRING
});

export default CategoryFilters;
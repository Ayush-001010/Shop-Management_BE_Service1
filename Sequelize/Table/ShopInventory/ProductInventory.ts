import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ProductInventory = sequelize.define("ProductInventoryTable", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ProductName: DataTypes.STRING,
    CategoryType: DataTypes.STRING,
    SubCategoryType: DataTypes.STRING,
    Quantity: DataTypes.INTEGER,
    CostToBuy: DataTypes.DECIMAL,
    PerItemProfit: DataTypes.DECIMAL,
    ContainerName: DataTypes.STRING,
    RowNumber: DataTypes.INTEGER,
    ColumnNumber: DataTypes.INTEGER,
    Height: DataTypes.INTEGER,
    Width: DataTypes.INTEGER,
    Depth: DataTypes.INTEGER,
    LowStock: DataTypes.INTEGER,
    ExpiredDate: DataTypes.DATE,
    ProductImagesURL: DataTypes.STRING,
    ProductDescription: DataTypes.STRING,
    ProductPositionInfo: DataTypes.STRING
});

export default ProductInventory;
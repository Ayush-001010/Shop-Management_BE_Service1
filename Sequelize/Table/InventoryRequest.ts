import sequelize from "../dbConfig";
import { DataTypes } from "sequelize";

const InventoryRequest = sequelize.define("InventoryRequestTable", {
  ID: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true
  },
  ProductName: DataTypes.STRING,
  ProductType: DataTypes.STRING,
  ProductDescription: DataTypes.STRING,
  AddtionalNote: DataTypes.STRING,
  Quantity: DataTypes.INTEGER,
  Cost: DataTypes.DOUBLE,
  ExpectedReachedDate: DataTypes.DATE,
  ActualReachedDate: DataTypes.DATE,
  ClientName: DataTypes.STRING,
  ClientPhone: DataTypes.STRING,
  ClientCompany: DataTypes.STRING,
  RequestDate: DataTypes.DATE,
  OrderDate: DataTypes.DATE,
  RequestBy: DataTypes.STRING,
  Status: DataTypes.STRING,
  HoldReason: DataTypes.STRING,
  RejectedReason: DataTypes.STRING,
  ReachedDate: DataTypes.DATE
});

export default InventoryRequest;

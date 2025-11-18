import sequelize from "../dbConfig";
import { DataTypes } from "sequelize";

const OrganizationDetails = sequelize.define("organizationdetailstable", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: DataTypes.STRING,
    OrganizationName: DataTypes.STRING,
    FounderName: DataTypes.STRING,
    ContactPhoneNumber: DataTypes.STRING,
    ContactEmail: DataTypes.STRING,
    NumberOfShops: DataTypes.STRING,
    FoundingDate: DataTypes.DATE,
    OrganizationType: DataTypes.STRING,
    ProductCategories : DataTypes.STRING
})

export default OrganizationDetails;
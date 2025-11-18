import sequelize from "../dbConfig";
import { DataTypes } from "sequelize";

const ShopDetails = sequelize.define("ShopDetails", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    shopname: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    shopcontactnumber: DataTypes.STRING,
    shopemail: DataTypes.STRING,
    shoptype: DataTypes.STRING,
    leaseownername: DataTypes.STRING,
    leasestartdate: DataTypes.DATE,
    leaseenddate: DataTypes.DATE
})

export default ShopDetails;
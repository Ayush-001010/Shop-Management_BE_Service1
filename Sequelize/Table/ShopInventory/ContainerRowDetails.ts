import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ContainerRowDetails = sequelize.define("ContainerRowDetailsTable", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    RowNumber: DataTypes.INTEGER,
    RowHeight: DataTypes.INTEGER,
    NoOfColumns: DataTypes.INTEGER
});

export default ContainerRowDetails;
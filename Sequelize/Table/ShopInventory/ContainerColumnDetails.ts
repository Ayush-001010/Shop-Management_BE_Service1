import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const ContainerColumnDetails = sequelize.define("ContainerColumnDetailsTable", {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Width: DataTypes.INTEGER,
    ColumnNumber: DataTypes.INTEGER
});

export default ContainerColumnDetails;
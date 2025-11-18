import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const Container = sequelize.define("ContainerTable", {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: DataTypes.STRING,
    Height: DataTypes.INTEGER,
    Width: DataTypes.INTEGER,
    NoOfRows: DataTypes.INTEGER,
    Depth: DataTypes.INTEGER
});

export default Container;
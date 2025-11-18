import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const SalesCount = sequelize.define("SalesCountTable" , {
    ID : {
        autoIncrement :  true,
        primaryKey : true ,
        type : DataTypes.INTEGER
    },
    Year : DataTypes.STRING,
    Month : DataTypes.STRING,
    Count : DataTypes.INTEGER
});

export default SalesCount;
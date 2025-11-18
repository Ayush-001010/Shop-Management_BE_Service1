import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const Profit = sequelize.define("ProfitTable" , {
    ID : {
        autoIncrement :  true,
        primaryKey : true ,
        type : DataTypes.INTEGER
    },
    Year : DataTypes.STRING,
    Month : DataTypes.STRING,
    Profit : DataTypes.DOUBLE
});

export default Profit;
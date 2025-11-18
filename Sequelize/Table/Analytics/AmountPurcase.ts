import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const AmountPurcase = sequelize.define("AmountPurcaseTable" , {
    ID : {
        autoIncrement :  true,
        primaryKey : true ,
        type : DataTypes.INTEGER
    },
    Year : DataTypes.STRING,
    Month : DataTypes.STRING,
    Money : DataTypes.DOUBLE
});

export default AmountPurcase;
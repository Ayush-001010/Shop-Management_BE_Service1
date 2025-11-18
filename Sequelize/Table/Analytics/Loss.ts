import sequelize from "../../dbConfig";
import { DataTypes } from "sequelize";

const Loss = sequelize.define("LossTable" , {
    ID : {
        autoIncrement :  true,
        primaryKey : true ,
        type : DataTypes.INTEGER
    },
    Year : DataTypes.STRING,
    Month : DataTypes.STRING,
    Loss : DataTypes.DOUBLE
});

export default Loss;
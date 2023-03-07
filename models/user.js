module.exports=(sequelize,DataTypes)=>{

    const user = sequelize.define('user', {
        // Model attributes are defined here
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        password: {
            type: DataTypes.STRING,
            // allowNull defaults to true
            allowNull: false
        },
        username : {
            type: DataTypes.STRING,
            // allowNull defaults to true
            allowNull: false
        },
    
    }, {
        // Other model options go here
        freezeTableName:true
    });
    // `sequelize.define` also returns the model
    return user;
    }
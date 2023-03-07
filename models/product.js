
module.exports=(sequelize,DataTypes)=>{
    const product = sequelize.define('product', {
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        sku: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        manufacturer: {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        quantity: {
            type: DataTypes.INTEGER
            // allowNull defaults to true
        },
        date_added:{
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        date_last_updated:{
            type:DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        owner_user_id:{
            type: DataTypes.STRING
            //allowNull default to true
        }
    
    }, {
        // Other model options go here
        freezeTableName:true,
        createdAt:false,
        updatedAt:false
    });

    return product;
}

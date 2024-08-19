import { DataTypes, Model, Sequelize } from 'sequelize';

class Product extends Model {}

export default (sequelize: Sequelize) => {
  Product.init(
    {
      product_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      base_product_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'product',
      sequelize,
    },
  );

  return Product;
};

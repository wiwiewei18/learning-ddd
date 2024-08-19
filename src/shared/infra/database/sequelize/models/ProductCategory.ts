import { DataTypes, Model, Sequelize } from 'sequelize';

class ProductCategory extends Model {
  static associate(models: any) {
    ProductCategory.hasMany(models.BaseProduct, { as: 'BaseProduct', foreignKey: 'product_category_id' });
  }
}

export default (sequelize: Sequelize) => {
  ProductCategory.init(
    {
      product_category_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parent_product_category_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'product_category',
          key: 'product_category_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
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
      tableName: 'product_category',
      sequelize,
    },
  );

  return ProductCategory;
};

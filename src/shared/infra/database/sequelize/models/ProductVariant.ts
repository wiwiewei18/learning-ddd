import { DataTypes, Model, Sequelize } from 'sequelize';

class ProductVariant extends Model {
  static associate(models: any) {
    ProductVariant.belongsTo(models.BaseProduct, {
      foreignKey: 'base_product_id',
      targetKey: 'product_id',
      as: 'BaseProduct',
    });
  }
}

export default (sequelize: Sequelize) => {
  ProductVariant.init(
    {
      product_variant_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      base_product_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'base_product',
          key: 'product_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      thumbnail_image_url: {
        type: DataTypes.STRING,
      },
      regular_image_url: {
        type: DataTypes.STRING,
      },
      attributes: {
        type: DataTypes.JSON,
      },
      average_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      num_sales: {
        type: DataTypes.INTEGER,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'product_variant',
      sequelize,
    },
  );

  return ProductVariant;
};

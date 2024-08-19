import { DataTypes, Model, Sequelize } from 'sequelize';

class BaseProduct extends Model {
  static associate(models: any) {
    BaseProduct.belongsTo(models.ProductCategory, {
      foreignKey: 'product_category_id',
      targetKey: 'product_category_id',
      as: 'ProductCategory',
    });

    BaseProduct.belongsTo(models.StoreFront, {
      foreignKey: 'store_front_id',
      targetKey: 'store_front_id',
      as: 'StoreFront',
    });

    BaseProduct.hasMany(models.ProductVariant, { as: 'ProductVariant', foreignKey: 'product_variant_id' });
  }
}

export default (sequelize: Sequelize) => {
  BaseProduct.init(
    {
      product_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      average_rating: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      image_cover_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      num_sales: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_category_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'product_category',
          key: 'product_category_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      store_front_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'store_front',
          key: 'store_front_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      tableName: 'base_product',
      sequelize,
    },
  );

  return BaseProduct;
};

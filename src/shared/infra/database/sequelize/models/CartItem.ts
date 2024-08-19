import { DataTypes, Model, Sequelize } from 'sequelize';

class CartItem extends Model {
  static associate(models: any) {
    CartItem.belongsTo(models.Buyer, { foreignKey: 'buyer_id', targetKey: 'buyer_id', as: 'Buyer' });
  }
}

export default (sequelize: Sequelize) => {
  CartItem.init(
    {
      cart_item_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      buyer_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
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
      tableName: 'cart_item',
      sequelize,
    },
  );

  return CartItem;
};

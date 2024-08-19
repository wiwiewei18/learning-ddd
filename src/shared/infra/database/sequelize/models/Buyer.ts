import { DataTypes, Model, Sequelize } from 'sequelize';

export class Buyer extends Model {
  static associate(models: any) {
    Buyer.belongsTo(models.User, { foreignKey: 'base_user_id', targetKey: 'user_id', as: 'User' });
    Buyer.hasMany(models.CartItem, { foreignKey: 'buyer_id', as: 'CartItem' });
  }
}

export default (sequelize: Sequelize) => {
  Buyer.init(
    {
      buyer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      base_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
      tableName: 'buyer',
      sequelize,
    },
  );

  return Buyer;
};

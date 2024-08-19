import { DataTypes, Model, Sequelize } from 'sequelize';

export class Store extends Model {
  static associate(models: any) {
    Store.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_id', as: 'User' });
  }
}

export default (sequelize: Sequelize) => {
  Store.init(
    {
      store_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      address_detail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_joined: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      profile_image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      store_banner_image_url: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: 'store',
      sequelize,
    },
  );

  return Store;
};

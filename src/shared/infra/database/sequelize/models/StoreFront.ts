import { DataTypes, Model, Sequelize } from 'sequelize';

export class StoreFront extends Model {
  static associate(models: any) {
    StoreFront.belongsTo(models.Store, { foreignKey: 'base_store_id', targetKey: 'store_id', as: 'Store' });

    StoreFront.hasMany(models.BaseProduct, { as: 'BaseProduct', foreignKey: 'store_front_id' });
  }
}

export default (sequelize: Sequelize) => {
  StoreFront.init(
    {
      base_store_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'store',
          key: 'store_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      store_front_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      date_joined: {
        type: DataTypes.DATE,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
      },
      profile_image_url: {
        type: DataTypes.STRING,
      },
      store_front_banner_image_url: {
        type: DataTypes.STRING,
      },
      average_rating: {
        type: DataTypes.INTEGER,
      },
      num_ratings: {
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
      tableName: 'store_front',
      sequelize,
    },
  );

  return StoreFront;
};

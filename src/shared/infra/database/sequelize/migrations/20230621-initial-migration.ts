import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationUtils } from '../migrationUtil';

export default {
  up: async (queryInterface: QueryInterface) => {
    const CREATE_USER = () => {
      return queryInterface.createTable('user', {
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_email_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
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
      });
    };

    const CREATE_STORE = () => {
      return queryInterface.createTable('store', {
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
      });
    };

    const CREATE_STORE_FRONT = () => {
      return queryInterface.createTable('store_front', {
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
      });
    };

    const CREATE_PRODUCT_CATEGORY = () => {
      return queryInterface.createTable('product_category', {
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
      });
    };

    const CREATE_BASE_PRODUCT = () => {
      return queryInterface.createTable('base_product', {
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
      });
    };

    const CREATE_PRODUCT_VARIANT = () => {
      return queryInterface.createTable('product_variant', {
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
      });
    };

    const CREATE_BUYER = () => {
      return queryInterface.createTable('buyer', {
        buyer_id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        base_user_id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
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
      });
    };

    const CREATE_CART_ITEM = () => {
      return queryInterface.createTable('cart_item', {
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
      });
    };

    const CREATE_PRODUCT = () => {
      return queryInterface.createTable('product', {
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
      });
    };

    const CREATE_WAREHOUSE = () => {
      return queryInterface.createTable('warehouse', {
        warehouse_id: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        zip_code: {
          type: DataTypes.STRING,
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
      });
    };

    await MigrationUtils.run([
      () => CREATE_USER(),
      () => CREATE_STORE(),
      () => CREATE_STORE_FRONT(),
      () => CREATE_PRODUCT_CATEGORY(),
      () => CREATE_BASE_PRODUCT(),
      () => CREATE_PRODUCT_VARIANT(),
      () => CREATE_BUYER(),
      () => CREATE_PRODUCT(),
      () => CREATE_CART_ITEM(),
      () => CREATE_WAREHOUSE(),
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    return MigrationUtils.run([
      () => queryInterface.dropTable('buyer'),
      () => queryInterface.dropTable('user'),
      () => queryInterface.dropTable('store_front'),
      () => queryInterface.dropTable('store'),
      () => queryInterface.dropTable('product_variant'),
      () => queryInterface.dropTable('base_product'),
      () => queryInterface.dropTable('product_category'),
      () => queryInterface.dropTable('cart_item'),
      () => queryInterface.dropTable('product'),
      () => queryInterface.dropTable('warehouse'),
    ]);
  },
};

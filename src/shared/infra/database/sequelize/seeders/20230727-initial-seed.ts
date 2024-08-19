import { QueryInterface } from 'sequelize';
import { UserRoles } from '../../../../../modules/users/domain/user/userRoles';

async function chainAsyncFunctions(funcs: (() => Promise<any>)[]) {
  for (const func of funcs) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await func();
    } catch (error: any) {
      if (error.original.code !== 'ER_DUP_ENTRY') {
        throw error;
      }
    }
  }
}

export default {
  up: async (queryInterface: QueryInterface) => {
    async function seedUser() {
      return queryInterface.bulkInsert('user', [
        {
          user_id: '1',
          first_name: 'Eriec',
          phone_number: '+6585553858',
          country_code: 'SG',
          email: 'eriec@grip.com',
          password: '$2a$10$1BgzD3OXkZqeAS1NoqJKi.lGd03xYFh6GJLp0K4n9d7zT.7cIv.BK', // Password1!
          is_email_verified: true,
          role: UserRoles.SELLER,
        },
        {
          user_id: '2',
          first_name: 'Eriec',
          phone_number: '+6585553858',
          country_code: 'SG',
          email: 'eriec@grip.com',
          password: '$2a$10$1BgzD3OXkZqeAS1NoqJKi.lGd03xYFh6GJLp0K4n9d7zT.7cIv.BK', // Password1!
          is_email_verified: true,
          role: UserRoles.BUYER,
        },
      ]);
    }

    async function seedProductCategory() {
      return queryInterface.bulkInsert('product_category', [
        {
          product_category_id: '1',
          name: 'Education Material',
          code: 'edu-mat',
        },
      ]);
    }

    async function seedBaseProduct() {
      return queryInterface.bulkInsert('base_product', [
        {
          product_id: '1',
          name: 'frozen keyboard',
          description: 'cold af',
          image_cover_url: 'imgUrl',
          product_category_id: '1',
          store_front_id: '1',
        },
      ]);
    }

    async function seedProductVariant() {
      return queryInterface.bulkInsert('product_variant', [
        {
          product_variant_id: '1',
          base_product_id: '1',
          price: 20,
          stock: 1,
          is_default: true,
          is_active: true,
          average_rating: 0,
          num_sales: 0,
        },
      ]);
    }

    async function seedStore() {
      return queryInterface.bulkInsert('store', [
        {
          store_id: '1',
          user_id: '1',
          address_detail: 'around cosmos',
          country_code: 'SG',
          description: 'lawak gaming series',
          name: 'lawak',
          postal_code: '123123',
        },
      ]);
    }

    async function seedStoreFront() {
      return queryInterface.bulkInsert('store_front', [
        {
          base_store_id: '1',
          store_front_id: '1',
        },
      ]);
    }

    async function seedBuyer() {
      return queryInterface.bulkInsert('buyer', [
        {
          buyer_id: '1',
          base_user_id: '2',
        },
      ]);
    }

    async function seedProduct() {
      return queryInterface.bulkInsert('product', [
        {
          product_id: '1',
          base_product_id: '1',
          name: 'hehe',
          stock: 1,
        },
      ]);
    }

    await chainAsyncFunctions([
      () => seedUser(),
      () => seedBuyer(),
      () => seedStore(),
      () => seedStoreFront(),
      () => seedProductCategory(),
      () => seedBaseProduct(),
      () => seedProductVariant(),
      () => seedProduct(),
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    async function bulkDeleteUser() {
      await queryInterface.bulkDelete('user', {});
    }

    async function bulkDeleteProductCategory() {
      await queryInterface.bulkDelete('product_category', {});
    }

    await chainAsyncFunctions([() => bulkDeleteUser(), () => bulkDeleteProductCategory()]);
  },
};

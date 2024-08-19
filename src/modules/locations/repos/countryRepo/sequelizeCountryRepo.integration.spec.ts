/* eslint-disable no-await-in-loop */
import models from '../../../../shared/infra/database/sequelize/models';
import { Country } from '../../domain/country';
import { CountryRepo } from './countryRepo';
import { InMemoryCountryRepo } from './inMemoryCountryRepo';
import { SequelizeCountryRepo } from './sequelizeCountryRepo';

describe('CountryRepo', () => {
  let countryRepos: CountryRepo[];

  beforeEach(() => {
    countryRepos = [new InMemoryCountryRepo({ Country: [] }), new SequelizeCountryRepo(models)];
  });

  afterEach(async () => {
    await models.Country.destroy({ where: {} });
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe('save', () => {
    it('should be able to save country', async () => {
      for (const repo of countryRepos) {
        const country = Country.create({ name: 'Singapore', code: 'SG' }).getValue() as Country;

        await repo.save(country);

        expect(await repo.exists(country.countryId)).toBe(true);
      }
    });
  });
});

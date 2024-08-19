# Changelog

All notable changes to this project will be documented in this file.

### [0.2.1](https://bitbucket.org/grip-batam/smartapes-backend-ts/branches/compare/v0.2.1%0Dv0.2.0) (2023-10-03)


### Features

* **product:** expose the product variant id ([8ec277d](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/8ec277d7fd996760c6befa4f2123f57910acaf02))
* **sql:** centralize initial seed setup ([d9806ea](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/d9806eaf84d6f4a824f92f8dab44a2859ff4f27b))
* **user:** buyer or seller email verified domain event ([53108af](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/53108af69be7c4492661034d58db0582d5f1d429))
* **user:** change error message for invalid email and password input ([ac5f575](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/ac5f575f293f2f6f2ab5d1a373fb967d8a34394f))


### Bug Fixes

* **buyer:** remove email column on Buyer sql model ([8c63115](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/8c63115d5591d8140edcc066a3b0b11abc690b1b))
* **user:** is email verified indication ([52d556a](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/52d556a43a938398e543d5d0b4d77c7891aa7fcb))

## [0.2.0](https://bitbucket.org/grip-batam/smartapes-backend-ts/branches/compare/v0.2.0%0Dv0.1.2) (2023-10-02)


### Features

* adapt changes for user domain context ([3a6448a](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3a6448a243f716cef625e3db5bbfff04b2f356a1))
* **base-controller:** add required API route ([902001f](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/902001f146e0c8dd1303d7c75ba899d9fc04006b))
* **buyer:** get buyer by base user id method ([7820c15](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/7820c153f551d8cccd9d38b0efd77d31ad70512d))
* **cart:** appi endpoint for add product to cart ([af43310](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/af433108d502d64c6a02b2256c707302159cde33))
* order subscriptions ([6e2c2f8](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6e2c2f8c93832b11dbc2b9790faa5dec9ba9dfcd))
* **order:** add product to cart use case ([8861157](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/8861157f5b953bb91814cdc970d794bd4af7bd13))
* **order:** create buyer use case ([cb61287](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/cb6128710d89cb7ca32a87c2717e63841fe9b41c))
* **order:** initialize buyer domain model ([6001603](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/60016039fcc3a49ef19b939893586404775e4d62))
* **order:** product domain & persistence layer ([e07710b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e07710b813a7f6a54ca14459d73629e60327d306))
* **user:** user context ([02767e5](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/02767e5b71141f752fab76980bc068452705775b))

### [0.1.2](https://bitbucket.org/grip-batam/smartapes-backend-ts/branches/compare/v0.1.2%0Dv0.1.1) (2023-09-07)

### [0.1.1](https://bitbucket.org/grip-batam/smartapes-backend-ts/branches/compare/v0.1.1%0Dv0.1.0) (2023-09-07)

## [0.1.0](https://bitbucket.org/grip-batam/smartapes-backend-ts/branches/compare/v0.1.0%0Dv0.0.1) (2023-09-07)

### ⚠ BREAKING CHANGES

- **buyer:** `/users` -> `/users/buyers`

### Features

- add `country_code` field on `Buyer` and `Seller` database table ([1ecb5e9](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/1ecb5e92cbbd9b1c659f7eae6306ab96792aadff))
- add store domain and repo on register as seller use case ([3b816d0](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3b816d0e452df4814e81aca9d73464b86def3a94))
- **agenda:** make it manually to start agenda service ([cb39dad](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/cb39dadaf40da77b4a73b7495d9f8f05514d5c18))
- **auth-service:** generate refresh token & save authenticated user ([5be3164](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/5be316448b4d28c65552cdaae33398cf56c8fec0))
- **auth-service:** google recaptcha ([17f00cd](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/17f00cddd4dc8be177b08f509dc076d1c111f10e))
- automatically update the `updated_at` field on sequelize model upon using the `save` method ([e711ce1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e711ce1a98066986f151248ef437dedcedd50746))
- **base-product-repo:** add product variants saving with base product using unit of work pattern ([0117e09](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/0117e09ec457585b6fae0d44af0a6df347979ea7))
- **buyer-repo:** convert raw buyer to domain object on query ([24adae4](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/24adae47a639ea872202c80a036f8ca17bb3a4c6))
- **buyer:** login as buyer usecase ([455ee58](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/455ee5854c60c8fc7a4f769dada48c877b80bd5d))
- **buyer:** set access token upon buyer login ([e185c05](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e185c05f1ea8ac314c054aeebd55ea6568579b27))
- **buyer:** verify email api ([3c58384](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3c58384dd2d14e972f76b8fe1e156e17a92dab7a))
- **buyer:** verify email use case ([d61ea39](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/d61ea39e4132bcee2b42ca4264ddd26d37af93a6))
- **image-service:** initialize using sharp package ([be8adf2](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/be8adf242defbc5e0ef367c1b4ee9e384418e5d2))
- **middleware:** ensure authentication by access token ([747967f](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/747967f10e748aaa59bcd10ce8fda610e35e8985))
- **notification:** add option for send seller email verification ([e4ca617](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e4ca61762afe090b82b9367336f0159fe682581b))
- **product-category:** initialize repo, mapper and DTO ([6eddef5](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6eddef5db839f7fc92e5c10fd7b8867b1f649ae3))
- **product-category:** read model ([26ae923](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/26ae9233962719940d025a089e30dfe27d0a70a7))
- **product-detail:** product read domain model ([6aee3c1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6aee3c1612d5eca2ac62c37f9e673d815f71e4b6))
- **product-details:** implement initial read model for product details ([b4914b9](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/b4914b905f24e5fc5f6f2ae6f2766043739b67af))
- **product-service:** variant attribute validation ([c1f1312](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/c1f1312c46a1d18bafff7cee01017f7762dc1ba7))
- **product-variant:** initialize product variant repo ([3e591c4](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3e591c47dc84c16f24f88920958e82974028b4ba))
- **product-variant:** set the image in variant to not mandatory ([02fb300](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/02fb300c30475e8724be05b255a0a0a5375e4dd5))
- **product-variants:** improve compare logic on product variants ([668713c](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/668713ce858770f5b9cdc7cbfa7a03ca0e4ff4b6))
- **product:** `product` -> `baseProduct` ([d06f8fd](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/d06f8fd4d33abd8d9d6aed4a405a2e0ca8ee3da4))
- **product:** get latest products use case ([58b8db1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/58b8db1f3261786ffc06a0741d0263a7b2609aa7))
- **product:** initialize create product controller ([125c1ea](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/125c1ea36268f187087d38ebbf2db47863ac49f3))
- **product:** initialize create product use case ([cf62661](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/cf626619423c22fa3bd40ba3689a324f260f320f))
- **product:** initialize product domain service ([5ff4c56](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/5ff4c56f8677a155044386c1a74b9009a627e91d))
- **product:** initialize write model for product ([30e3a41](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/30e3a4155900121695abbc841f0b17bc528fcd36))
- **product:** product repo ([027a464](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/027a464cabdbcef6b95fc96de3d921c03c47c3fa))
- **s3:** initialize S3 Bucket service ([c231e1f](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/c231e1ff42c960b648f25a4d0c3ecc67bfcc9339))
- **scheduler:** delegate scheduling of unverified user times to a specific use case ([833cf80](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/833cf80841fefad1a0138ea98503e652884f7e53))
- **scheduler:** schedule unverified seller deletion ([9049d88](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/9049d8808215ba644a0410f068795f5452b7b754))
- **scheduling:** separate schedule definition with schedule job name ([a40265a](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/a40265ab2e4354a2fa1a48dfc106f76ffb7f84ab))
- **seller-repo:** `getSellerBySellerId` method ([f79066b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/f79066bb909e62cf23f6f1f1e59f574152fd2db7))
- **seller-repo:** initialize `getSellerByEmail` & `getSellerByPhoneNumber` method ([a8db790](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/a8db79062899df4bfefddad3057a43434505d9ae))
- **seller-repo:** initialize seller repo ([a0a08d7](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/a0a08d738e7f342d280a326b25a7f8b11bcf0175))
- **seller:** delete seller usecase ([3aad4cf](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3aad4cf5e468d51a90f8e339d27468af79f911fc))
- **seller:** init seller registration API router ([387953d](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/387953d952cd123eefe9effb9a95ae27c3a22d31))
- **seller:** initialize domain model ([c2d41d2](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/c2d41d29f95c467dfb235a7e2f5cb2806cf2906e))
- **seller:** seller login usecase ([6201b4b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6201b4b4995ad6b33bb685eb89c722aec738507a))
- **seller:** seller registration use case ([e498cd5](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e498cd5bf28cd9dbc7e0d865f62ada19adc07108))
- **store-front:** create store front use case ([02a9bcc](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/02a9bcc8787a0dd5ccf326bdc45a2d78b4ab8899))
- **store-front:** initialize domain model ([b0c738a](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/b0c738ac3856fb5f6cab86a1374b102d77c6c371))
- **store-front:** initialize store front domain model ([ec27dd1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/ec27dd19c60066abd26edc5485e15709034cc132))
- **store-repo:** `getStoreByName` method ([2524d96](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/2524d960b47d50ae696acab2f13f6d66f067ef14))
- **store:** init `Store` database model ([945634c](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/945634c6dacf356640c42003de67c045c4445855))
- **store:** init `storeRepo` ([e90af88](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e90af88b577f93efab3c6a1a0cbf3d88122eca7f))
- **store:** initial store domain model ([f1ab7f1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/f1ab7f1d45da26249d233b5db02b45330db33149))
- **subscription:** after store created subscription ([e460f0c](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e460f0cf31e3849bd54f4ff97a7d5f8fd8e2a8b9))

### Bug Fixes

- **auth-service:** wrong boolean when validating jwt ([28c624b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/28c624b5238578681cd8fd5cd4befd7d677a23dc))
- **notification:** url escaped in email body html ([598479e](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/598479eefa8ebd7e8f4a113581cfdda1e47a67dd))
- **scheduler:** use in memory storage for agenda when testing ([4c413c4](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/4c413c46351f83befda6ab3e97bd04a0d628ad5b))

## [0.1.0](https://bitbucket.org/grip-batam/smartapes-backend-ts/branches/compare/v0.0.1...v0.1.0) (2023-09-07)

### ⚠ BREAKING CHANGES

- **buyer:** `/users` -> `/users/buyers`

### Features

- add `country_code` field on `Buyer` and `Seller` database table ([1ecb5e9](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/1ecb5e92cbbd9b1c659f7eae6306ab96792aadff))
- add store domain and repo on register as seller use case ([3b816d0](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3b816d0e452df4814e81aca9d73464b86def3a94))
- **agenda:** make it manually to start agenda service ([cb39dad](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/cb39dadaf40da77b4a73b7495d9f8f05514d5c18))
- **auth-service:** generate refresh token & save authenticated user ([5be3164](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/5be316448b4d28c65552cdaae33398cf56c8fec0))
- **auth-service:** google recaptcha ([17f00cd](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/17f00cddd4dc8be177b08f509dc076d1c111f10e))
- automatically update the `updated_at` field on sequelize model upon using the `save` method ([e711ce1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e711ce1a98066986f151248ef437dedcedd50746))
- **base-product-repo:** add product variants saving with base product using unit of work pattern ([0117e09](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/0117e09ec457585b6fae0d44af0a6df347979ea7))
- **buyer-repo:** convert raw buyer to domain object on query ([24adae4](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/24adae47a639ea872202c80a036f8ca17bb3a4c6))
- **buyer:** login as buyer usecase ([455ee58](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/455ee5854c60c8fc7a4f769dada48c877b80bd5d))
- **buyer:** set access token upon buyer login ([e185c05](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e185c05f1ea8ac314c054aeebd55ea6568579b27))
- **buyer:** verify email api ([3c58384](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3c58384dd2d14e972f76b8fe1e156e17a92dab7a))
- **buyer:** verify email use case ([d61ea39](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/d61ea39e4132bcee2b42ca4264ddd26d37af93a6))
- **image-service:** initialize using sharp package ([be8adf2](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/be8adf242defbc5e0ef367c1b4ee9e384418e5d2))
- **middleware:** ensure authentication by access token ([747967f](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/747967f10e748aaa59bcd10ce8fda610e35e8985))
- **notification:** add option for send seller email verification ([e4ca617](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e4ca61762afe090b82b9367336f0159fe682581b))
- **product-category:** initialize repo, mapper and DTO ([6eddef5](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6eddef5db839f7fc92e5c10fd7b8867b1f649ae3))
- **product-category:** read model ([26ae923](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/26ae9233962719940d025a089e30dfe27d0a70a7))
- **product-detail:** product read domain model ([6aee3c1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6aee3c1612d5eca2ac62c37f9e673d815f71e4b6))
- **product-details:** implement initial read model for product details ([b4914b9](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/b4914b905f24e5fc5f6f2ae6f2766043739b67af))
- **product-service:** variant attribute validation ([c1f1312](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/c1f1312c46a1d18bafff7cee01017f7762dc1ba7))
- **product-variant:** initialize product variant repo ([3e591c4](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3e591c47dc84c16f24f88920958e82974028b4ba))
- **product-variant:** set the image in variant to not mandatory ([02fb300](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/02fb300c30475e8724be05b255a0a0a5375e4dd5))
- **product-variants:** improve compare logic on product variants ([668713c](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/668713ce858770f5b9cdc7cbfa7a03ca0e4ff4b6))
- **product:** `product` -> `baseProduct` ([d06f8fd](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/d06f8fd4d33abd8d9d6aed4a405a2e0ca8ee3da4))
- **product:** get latest products use case ([58b8db1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/58b8db1f3261786ffc06a0741d0263a7b2609aa7))
- **product:** initialize create product controller ([125c1ea](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/125c1ea36268f187087d38ebbf2db47863ac49f3))
- **product:** initialize create product use case ([cf62661](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/cf626619423c22fa3bd40ba3689a324f260f320f))
- **product:** initialize product domain service ([5ff4c56](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/5ff4c56f8677a155044386c1a74b9009a627e91d))
- **product:** initialize write model for product ([30e3a41](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/30e3a4155900121695abbc841f0b17bc528fcd36))
- **product:** product repo ([027a464](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/027a464cabdbcef6b95fc96de3d921c03c47c3fa))
- **s3:** initialize S3 Bucket service ([c231e1f](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/c231e1ff42c960b648f25a4d0c3ecc67bfcc9339))
- **scheduler:** delegate scheduling of unverified user times to a specific use case ([833cf80](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/833cf80841fefad1a0138ea98503e652884f7e53))
- **scheduler:** schedule unverified seller deletion ([9049d88](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/9049d8808215ba644a0410f068795f5452b7b754))
- **scheduling:** separate schedule definition with schedule job name ([a40265a](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/a40265ab2e4354a2fa1a48dfc106f76ffb7f84ab))
- **seller-repo:** `getSellerBySellerId` method ([f79066b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/f79066bb909e62cf23f6f1f1e59f574152fd2db7))
- **seller-repo:** initialize `getSellerByEmail` & `getSellerByPhoneNumber` method ([a8db790](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/a8db79062899df4bfefddad3057a43434505d9ae))
- **seller-repo:** initialize seller repo ([a0a08d7](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/a0a08d738e7f342d280a326b25a7f8b11bcf0175))
- **seller:** delete seller usecase ([3aad4cf](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/3aad4cf5e468d51a90f8e339d27468af79f911fc))
- **seller:** init seller registration API router ([387953d](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/387953d952cd123eefe9effb9a95ae27c3a22d31))
- **seller:** initialize domain model ([c2d41d2](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/c2d41d29f95c467dfb235a7e2f5cb2806cf2906e))
- **seller:** seller login usecase ([6201b4b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/6201b4b4995ad6b33bb685eb89c722aec738507a))
- **seller:** seller registration use case ([e498cd5](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e498cd5bf28cd9dbc7e0d865f62ada19adc07108))
- **store-front:** create store front use case ([02a9bcc](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/02a9bcc8787a0dd5ccf326bdc45a2d78b4ab8899))
- **store-front:** initialize domain model ([b0c738a](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/b0c738ac3856fb5f6cab86a1374b102d77c6c371))
- **store-front:** initialize store front domain model ([ec27dd1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/ec27dd19c60066abd26edc5485e15709034cc132))
- **store-repo:** `getStoreByName` method ([2524d96](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/2524d960b47d50ae696acab2f13f6d66f067ef14))
- **store:** init `Store` database model ([945634c](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/945634c6dacf356640c42003de67c045c4445855))
- **store:** init `storeRepo` ([e90af88](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e90af88b577f93efab3c6a1a0cbf3d88122eca7f))
- **store:** initial store domain model ([f1ab7f1](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/f1ab7f1d45da26249d233b5db02b45330db33149))
- **subscription:** after store created subscription ([e460f0c](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/e460f0cf31e3849bd54f4ff97a7d5f8fd8e2a8b9))

### Bug Fixes

- **auth-service:** wrong boolean when validating jwt ([28c624b](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/28c624b5238578681cd8fd5cd4befd7d677a23dc))
- **notification:** url escaped in email body html ([598479e](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/598479eefa8ebd7e8f4a113581cfdda1e47a67dd))
- **scheduler:** use in memory storage for agenda when testing ([4c413c4](https://bitbucket.org/grip-batam/smartapes-backend-ts/commits/4c413c46351f83befda6ab3e97bd04a0d628ad5b))

### 0.0.1 (2023-07-14)

import { MockProxy, mock } from 'jest-mock-extended';
import { Result } from '../../../../../shared/core/Result';
import { ProductCategory } from '../../../domain/product/entities/productCategory/productCategory';
import { ProductCategoryCode } from '../../../domain/product/entities/productCategory/valueObjects/productCategoryCode';
import { ProductCategoryName } from '../../../domain/product/entities/productCategory/valueObjects/productCategoryName';
import { ProductService } from '../../../domain/services/productService';
import { StoreFront } from '../../../domain/storeFront/storeFront';
import { createRandomStoreFront } from '../../../domain/storeFront/tests/fixtures/storeFront.fixture';
import { BaseProductRepo } from '../../../repos/product/baseProductRepo/baseProductRepo';
import { ProductCategoryRepo } from '../../../repos/product/categoryRepo/categoryRepo';
import { StoreFrontRepo } from '../../../repos/storeFront/storeFrontRepo';
import { ContentStorageService, ContentTypes } from '../../../services/contentStorageService/contentStorageService';
import { ImageService } from '../../../services/imageService/imageService';
import { CreateProductErrors } from './createProductErrors';
import { ImagePropsRequestDTO } from './createProductRequestDTO';
import { CreateProductUseCase } from './createProductUseCase';

let mockProductRepo: MockProxy<BaseProductRepo>;
let productService: ProductService;
let mockProductCategoryRepo: MockProxy<ProductCategoryRepo>;
let mockStoreFrontRepo: MockProxy<StoreFrontRepo>;
let mockImageService: MockProxy<ImageService>;
let mockContentStorageService: MockProxy<ContentStorageService>;
const mockImageProps: ImagePropsRequestDTO = {
  buffer: Buffer.from('mockImageData', 'base64'),
  extension: 'png',
  fileSize: 8,
};
let category: ProductCategory;
let storeFront: StoreFront;

describe('Create Product', () => {
  beforeEach(() => {
    mockProductRepo = mock<BaseProductRepo>();
    mockProductRepo.getProductByName.mockResolvedValue(Result.notFound('e'));

    productService = new ProductService();

    category = ProductCategory.create({
      name: ProductCategoryName.create('Education Material').getValue() as ProductCategoryName,
      code: ProductCategoryCode.create('EDCTNMTRL').getValue() as ProductCategoryCode,
    }).getValue() as ProductCategory;
    mockProductCategoryRepo = mock<ProductCategoryRepo>();
    mockProductCategoryRepo.getCategoryById.mockResolvedValue(Result.found(category));

    storeFront = createRandomStoreFront();
    mockStoreFrontRepo = mock<StoreFrontRepo>();
    mockStoreFrontRepo.getStoreFrontById.mockResolvedValue(Result.found(storeFront));

    mockImageService = mock<ImageService>();
    mockImageService.resizeImage.mockResolvedValue(Buffer.from('resizedBuffer', 'base64'));
    mockImageService.resizeImageBulk.mockResolvedValue([
      { buffer: Buffer.from('resizedBuffer', 'base64'), config: { extension: 'webp', width: 700 } },
    ]);

    mockContentStorageService = mock<ContentStorageService>();
    mockContentStorageService.save.mockResolvedValue('imageUrl');
  });

  describe('Scenario: Seller successfully create single physical product with no variant', () => {
    describe('Given Seller provide valid product details with no variant', () => {
      describe('When Seller attempt to create single physical product with no variant', () => {
        test('Then the Product should be created', async () => {
          const createProductUseCase = new CreateProductUseCase(
            mockProductRepo,
            productService,
            mockProductCategoryRepo,
            mockStoreFrontRepo,
            mockImageService,
            mockContentStorageService,
          );

          const result = await createProductUseCase.execute({
            description: 'good product',
            dimension: {
              heightInMM: 1,
              lengthInMM: 1,
              widthInMM: 1,
            },
            imageCover: {
              buffer: mockImageProps.buffer,
              extension: mockImageProps.extension,
              fileSize: mockImageProps.fileSize,
            },
            isActive: true,
            isFeaturedProduct: true,
            name: 'frozen keyboard',
            productCategoryId: '123',
            storeFrontId: '123',
            variants: [
              {
                price: 20,
                stock: 10,
                isDefault: true,
              },
            ],
            weightInGram: 100,
          });

          expect(result.isRight()).toBe(true);
          expect(mockProductRepo.save).toHaveBeenCalled();
          expect(mockContentStorageService.save).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Scenario: Seller successfully create single physical product with more than 1 variant', () => {
    describe('Given Seller provide valid product details with more than 1 variant', () => {
      describe('When Seller attempt to create single physical product with more than 1 variant', () => {
        test('Then the Product should be created', async () => {
          const createProductUseCase = new CreateProductUseCase(
            mockProductRepo,
            productService,
            mockProductCategoryRepo,
            mockStoreFrontRepo,
            mockImageService,
            mockContentStorageService,
          );

          const result = await createProductUseCase.execute({
            description: 'good product',
            dimension: {
              heightInMM: 1,
              lengthInMM: 1,
              widthInMM: 1,
            },
            imageCover: {
              buffer: mockImageProps.buffer,
              extension: mockImageProps.extension,
              fileSize: mockImageProps.fileSize,
            },
            isActive: true,
            isFeaturedProduct: true,
            name: 'frozen keyboard',
            productCategoryId: '123',
            storeFrontId: '123',
            variants: [
              {
                attributes: [
                  {
                    name: 'Size',
                    option: 'M',
                  },
                ],
                price: 20,
                stock: 10,
                isDefault: true,
                image: {
                  buffer: mockImageProps.buffer,
                  extension: mockImageProps.extension,
                  fileSize: mockImageProps.fileSize,
                },
              },
              {
                attributes: [
                  {
                    name: 'Size',
                    option: 'S',
                  },
                ],
                price: 21,
                stock: 11,
                isDefault: false,
              },
            ],
            weightInGram: 100,
          });

          expect(result.isRight()).toBe(true);
          expect(mockProductRepo.save).toHaveBeenCalled();

          type ContentStorageServiceSaveParams = Parameters<typeof mockContentStorageService.save>;
          expect(mockContentStorageService.save).toHaveBeenCalledWith<ContentStorageServiceSaveParams>(
            ContentTypes.IMAGE,
            expect.any(String),
            expect.any(Buffer),
          );
        });
      });
    });
  });

  describe('Scenario: Seller fail to create single physical product with one of the variant is invalid', () => {
    describe('Given Seller provides 2 variants with the first variant valid with image And the second variant is invalid', () => {
      describe('When Seller attempt to create single physical product', () => {
        test('Then the Product should not created And the images that has been created should be deleted', async () => {
          const createProductUseCase = new CreateProductUseCase(
            mockProductRepo,
            productService,
            mockProductCategoryRepo,
            mockStoreFrontRepo,
            mockImageService,
            mockContentStorageService,
          );

          const result = await createProductUseCase.execute({
            description: 'good product',
            dimension: {
              heightInMM: 1,
              lengthInMM: 1,
              widthInMM: 1,
            },
            imageCover: {
              buffer: mockImageProps.buffer,
              extension: mockImageProps.extension,
              fileSize: mockImageProps.fileSize,
            },
            isActive: true,
            isFeaturedProduct: true,
            name: 'frozen keyboard',
            productCategoryId: '123',
            storeFrontId: '123',
            variants: [
              {
                attributes: [
                  {
                    name: 'Size',
                    option: 'M',
                  },
                ],
                price: 20,
                stock: 10,
                isDefault: true,
                image: {
                  buffer: mockImageProps.buffer,
                  extension: mockImageProps.extension,
                  fileSize: mockImageProps.fileSize,
                },
              },
              {
                // add invalid variant
                attributes: [],
                price: 0,
                stock: 11,
                isDefault: false,
              },
            ],
            weightInGram: 100,
          });

          expect(result.isLeft()).toBe(true);
          expect(mockProductRepo.save).not.toHaveBeenCalled();

          // 1 image cover, 2 times for 1 variant has a regular and thumbnail image
          expect(mockContentStorageService.deleteByUrl).toHaveBeenCalledTimes(3);
        });
      });
    });
  });

  describe('Scenario: Seller fail to create single physical product with duplicate variant', () => {
    describe('Given Seller provides 2 variants with same attributes', () => {
      describe('When Seller attempt to create single physical product', () => {
        test('Then the Product should not created', async () => {
          const createProductUseCase = new CreateProductUseCase(
            mockProductRepo,
            productService,
            mockProductCategoryRepo,
            mockStoreFrontRepo,
            mockImageService,
            mockContentStorageService,
          );

          const result = await createProductUseCase.execute({
            description: 'good product',
            dimension: {
              heightInMM: 1,
              lengthInMM: 1,
              widthInMM: 1,
            },
            imageCover: {
              buffer: mockImageProps.buffer,
              extension: mockImageProps.extension,
              fileSize: mockImageProps.fileSize,
            },
            isActive: true,
            isFeaturedProduct: true,
            name: 'frozen keyboard',
            productCategoryId: '123',
            storeFrontId: '123',
            variants: [
              {
                attributes: [
                  {
                    name: 'Size',
                    option: 'M',
                  },
                ],
                price: 20,
                stock: 10,
                isDefault: true,
                image: {
                  buffer: mockImageProps.buffer,
                  extension: mockImageProps.extension,
                  fileSize: mockImageProps.fileSize,
                },
              },
              {
                attributes: [
                  {
                    name: 'Size',
                    option: 'M',
                  },
                ],
                price: 1,
                stock: 11,
                isDefault: false,
              },
            ],
            weightInGram: 100,
          });

          expect(result.isLeft()).toBe(true);
          expect(result.value.constructor).toEqual(CreateProductErrors.DuplicateVariantAttributeOption);
          expect(mockProductRepo.save).not.toHaveBeenCalled();
        });
      });
    });
  });
});

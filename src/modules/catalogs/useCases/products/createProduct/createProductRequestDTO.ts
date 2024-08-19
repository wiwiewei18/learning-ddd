export interface ImagePropsRequestDTO {
  fileSize: number;
  extension: string;
  buffer: Buffer;
}

export interface ProductAttributeRequestDTO {
  name: string;
  option: string;
}

export interface ProductVariantRequestDTO {
  price: number;
  stock: number;
  isDefault: boolean;
  sku?: string;
  attributes?: ProductAttributeRequestDTO[];
  image?: ImagePropsRequestDTO;
}

export interface ProductDimensionRequestDTO {
  lengthInMM: number;
  widthInMM: number;
  heightInMM: number;
}

export interface CreateProductRequestDTO {
  storeFrontId: string;
  imageCover: ImagePropsRequestDTO;
  additionalImages?: ImagePropsRequestDTO[];
  name: string;
  productCategoryId: string;
  description: string;
  isFeaturedProduct?: boolean;
  isActive: boolean;
  variants: ProductVariantRequestDTO[];
  weightInGram: number;
  dimension: ProductDimensionRequestDTO;
}

import { BaseProductPersistenceDTO } from './baseProductDTO';

export interface ProductVariantPersistenceDTO {
  product_variant_id: string;
  base_product_id: string;
  price: number;
  stock: number;
  is_default: boolean;
  attributes: string;
  thumbnail_image_url?: string;
  regular_image_url?: string;
  average_rating?: number;
  num_sales?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  BaseProduct?: BaseProductPersistenceDTO;
}

export interface ProductVariantPublicDTO {
  productVariantId: string;
  name: string;
  price: string;
  averageRating: number;
  numSales: number;
  thumbnailImageUrl: string;
}

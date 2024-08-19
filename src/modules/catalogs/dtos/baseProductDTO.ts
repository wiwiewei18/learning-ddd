import { ProductCategoryPublicDTO } from './productCategoryDTO';

export interface BaseProductPublicDTO {
  imageCoverUrl: string;
  name: string;
  description: string;
  averageRating: number;
  numSales: number;
  category: ProductCategoryPublicDTO;
}

export interface BaseProductPersistenceDTO {
  product_id: string;
  store_front_id: string;
  product_category_id: string;
  description: string;
  name: string;
  image_cover_url: string;
  average_rating?: number;
  num_sales?: number;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

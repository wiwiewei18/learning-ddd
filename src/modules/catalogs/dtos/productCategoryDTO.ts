export interface ProductCategoryPublicDTO {
  name: string;
}

export interface ProductCategoryPersistenceDTO {
  product_category_id: string;
  name: string;
  code: string;
  parent_product_category_id?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

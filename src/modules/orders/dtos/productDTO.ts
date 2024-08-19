export interface ProductPersistenceDTO {
  product_id: string;
  base_product_id: string;
  name: string;
  stock: number;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CartItemPersistenceDTO {
  cart_item_id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

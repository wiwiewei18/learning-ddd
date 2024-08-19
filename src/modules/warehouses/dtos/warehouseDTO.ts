export interface WarehousePublicDTO {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

export interface WarehousePersistenceDTO {
  warehouse_id: string;
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zip_code: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

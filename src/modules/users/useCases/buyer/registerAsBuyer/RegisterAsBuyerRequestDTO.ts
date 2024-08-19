export interface RegisterAsBuyerRequestDTO {
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  countryCode?: string;
  email: string;
  password: string;
}

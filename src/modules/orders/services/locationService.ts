export interface LocationService {
  isCountryAvailable(countryCode: string): Promise<boolean>;
  isZipCodeValid(code: string): Promise<boolean>;
}

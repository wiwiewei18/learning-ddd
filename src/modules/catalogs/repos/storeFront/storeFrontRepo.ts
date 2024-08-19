import { Maybe } from '../../../../shared/core/Result';
import { StoreFront } from '../../domain/storeFront/storeFront';
import { StoreFrontId } from '../../domain/storeFront/valueObjects/storeFrontId';

export interface StoreFrontRepo {
  getStoreFrontById(storeFrontId: string): Promise<Maybe<StoreFront>>;
  exists(storeFrontId: StoreFrontId): Promise<boolean>;
  save(storeFront: StoreFront): Promise<void>;
  getStoreFrontByName(name: string): Promise<Maybe<StoreFront>>;
}

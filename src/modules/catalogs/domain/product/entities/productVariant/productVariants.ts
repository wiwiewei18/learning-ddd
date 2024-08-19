import { WatchedList } from '../../../../../../shared/domain/WatchedList';
import { ProductVariant } from './productVariant';

export class ProductVariants extends WatchedList<ProductVariant> {
  private constructor(initialVariants: ProductVariant[]) {
    super(initialVariants);
  }

  compareItems(a: ProductVariant, b: ProductVariant): boolean {
    if (a.equals(b)) {
      return true;
    }

    if (!a.attributes || !b.attributes) {
      return false;
    }

    if (a.attributes?.length !== b.attributes?.length) {
      return false;
    }

    const aAttributes = a.attributes.map((_a) => _a.value).sort((aAtr, bAtr) => (aAtr.name > bAtr.name ? 1 : -1));
    const bAttributes = b.attributes.map((_b) => _b.value).sort((aAtr, bAtr) => (aAtr.name > bAtr.name ? 1 : -1));

    for (let i = 0; i < aAttributes.length; i++) {
      const itemA = aAttributes[i];
      const itemB = bAttributes[i];

      if (itemA.name !== itemB.name || itemA.option !== itemB.option) {
        return false;
      }
    }

    return true;
  }

  static create(productVariants?: ProductVariant[]): ProductVariants {
    return new ProductVariants(productVariants || []);
  }
}

import {Injectable} from '@angular/core';
import {VariantProduct} from '../models/variant-product.model';
import {Product} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductManager {
  defaultCode: [];

  public getSelectedCode(product: VariantProduct) {
    return product ? product.variantCode : this.defaultCode;
  }

  getVariantsCombinations(mainProduct: Product) {
    const variantCodes = [];
    const variantsCombinations = [];
    mainProduct.variantProducts.forEach(vProduct => {
      // to get only available variants
      if (vProduct.stockQty > 0) {
        // to get all variantCodes
        variantCodes.push(vProduct.variantCode);
        variantsCombinations[vProduct.variantCode[0]] = [];
      }
    });

    this.defaultCode = variantCodes[0];

    variantCodes.forEach((vCode: string[]) => {
      variantsCombinations[vCode[0]].push(vCode);
    });

    return variantsCombinations;
  }

  public selectVariant(mainProduct: Product, selectedCode: string[] = null) {
    const variantProducts: VariantProduct[] = mainProduct.variantProducts;
    const products = [];
    let product: VariantProduct;

    if (!selectedCode) {
      product = variantProducts[0];
      return product;
    } else {
      return variantProducts.find(
        vProduct =>
          JSON.stringify(vProduct.variantCode) === JSON.stringify(selectedCode)
      );
    }
  }

  getVariants(mainProduct: Product) {
    const primaryVariant = mainProduct.variants[0].values[0];
    this.getVariantAvailableCombination(primaryVariant, mainProduct);
  }

  getVariantAvailableCombination(primaryVariant, mainProduct) {
    if (!primaryVariant) {
      primaryVariant = mainProduct.variants[0].values[0];
    }
    const primaryVariantProducts = [];
    const primaryVariantCodes = [];

    mainProduct.variantProducts.forEach(variantProduct => {
      variantProduct.variantOption.forEach(VariantOption => {
        if (
          VariantOption.value === primaryVariant.value ||
          VariantOption.value === primaryVariant.pattern
        ) {
          primaryVariantProducts.push(variantProduct);
          const variantCode = [...variantProduct.variantCode];
          variantCode.shift();
          primaryVariantCodes.push(variantCode.shift());
        }
      });
    });

    const availableItems = {
      products: primaryVariantProducts,
      codes: primaryVariantCodes
    };
    return availableItems;
  }

  getProductByVariantCode(variantCode, mainProduct) {
    return mainProduct.variantProducts.find(
      vProduct =>
        JSON.stringify(vProduct.variantCode) === JSON.stringify(variantCode)
    );
  }
}

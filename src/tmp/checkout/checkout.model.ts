export class Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
  dateCreated: Date;
  lastUpdate: Date;
}
export class State {
  id: number;
  name: string;
}
export class Country {
  id: number;
  code: string;
  name: string;
}
export class CartItem {

  id: string;
  name: string;
  imageUrl: string;
  unitPrice: number;

  quantity: number;

  constructor(product: Product) {
    this.id = product.product_Id;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;

    this.quantity = 1;
  }
}
export class ProductCategory {
  id: number;
  categoryName: string;
}

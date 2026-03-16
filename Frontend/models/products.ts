export class Products {
  id?: number;
  name: string;
  price: number;
  sale: number;
  image: string;
  categoryId: number;
  constructor(
    id: number,
    name: string,
    price: number,
    sale: number,
    image: string,
    categoryId: number,
  ) {
    this.name = name;
    this.price = price;
    this.sale = sale;
    this.image = image;
    this.categoryId = categoryId;
  }
}

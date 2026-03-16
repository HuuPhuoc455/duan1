export class Product {
  id?: number;
  name: string;
  price: number;
  sale: number;
  stock: number;
  image: string;
  images: string[];
  categoryId: number;
  description: string;
  variants: { id: number; color: string; size?: string; stock: number }[];
  constructor(
    name: string,
    price: number,
    sale: number,
    stock: number,
    image: string,
    images: string[],
    categoryId: number,
    description: string,
    variants: { id: number; color: string; size?: string; stock: number }[],
  ) {
    this.name = name;
    this.price = price;
    this.sale = sale;
    this.stock = stock;
    this.image = image;
    this.images = images;
    this.categoryId = categoryId;
    this.description = description;
    this.variants = variants;
  }
}

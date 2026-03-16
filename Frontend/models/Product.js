export class Product {
    id;
    name;
    price;
    sale;
    stock;
    image;
    images;
    categoryId;
    description;
    variants;
    constructor(name, price, sale, stock, image, images, categoryId, description, variants) {
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

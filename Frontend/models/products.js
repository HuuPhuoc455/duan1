export class Products {
    id;
    name;
    price;
    sale;
    image;
    categoryId;
    constructor(id, name, price, sale, image, categoryId) {
        this.name = name;
        this.price = price;
        this.sale = sale;
        this.image = image;
        this.categoryId = categoryId;
    }
}

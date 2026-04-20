export type Variant = {
  _id: string;
  name: string;
  price: number;
  sale: number;
  duration: string;
  img: string;
};

export type Product = {
  _id: string;
  name: string;
  img: string;
  description: string;
  hot: number;
  categoryId:
    | string
    | {
        _id: string;
        name: string;
      };
  variants: Variant[];
};

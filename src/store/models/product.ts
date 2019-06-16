import { generateId } from '../../helpers/utils';


export interface IProduct {
  readonly id: string;

  name: string;
  price: number;
}

export default class Product implements IProduct {
  public readonly id: string;

  public name: string;
  public price: number;

  constructor(name: string, price: number) {
    this.id = generateId(10);
    this.name = name;
    this.price = price;
  }
}

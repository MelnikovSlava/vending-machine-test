import { Currency } from '../store/models/currency';
import Product, { IProduct } from '../store/models/product';


interface IDataFetch {
    baseURL: string;
    data: any;
    method: string;
    url: string;
}

export default function subscribeMockRequests(mockApi: any) {
    mockApi
        .onGet('/products').reply(getProducts)
        .onPost('/select').reply(200)
        .onPost('/buy').reply(200)
        .onAny()
        .passThrough();
}

const productList: IProduct[] = [
    new Product('Espresso', 1.5),
    new Product('Irish coffee', 3),
    new Product('Cortado', 1.7),
    new Product('Affogato', 2),
    new Product('Americano', 3),
    new Product('Bicerin', 2.1),
    new Product('Café Bombón', 4),
    new Product('Mokko', 2.7),
    new Product('Mochaccino', 2.2),
    new Product('Long Black', 4),
];

const currencyList: Currency[] = [{
    code: 'USD',
    symbol: '$',
    ratio: 1,
},
{
    code: 'EUR',
    symbol: '€',
    ratio: 0.89,
},
{
    code: 'RUB',
    symbol: '₽',
    ratio: 64.43,
}];

const baseCurrency = currencyList[0];

const getProducts = (info: IDataFetch) => {
    return [200, { productList, currencyList, baseCurrency }];
};

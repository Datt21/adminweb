import { Product } from './product';
import { ID } from '@datorama/akita';

export interface Category {
    id: ID;
    name: string;
    image: string;
    storeType: number;
    orderNumber: number;
    products: Product[];
}

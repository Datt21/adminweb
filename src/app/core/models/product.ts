import {ID} from '@datorama/akita';

export interface Product {
    id: ID;
    productId: string;
    fastFoodCategoryId: ID;
    name: string;
    image: string;
    description: string;
    order_number: number;
    updatedAt: string;
    price: string;
}

import { ID } from '@datorama/akita';

export interface Shop {
    id: ID;
    storeName: string;
    address: string;
    sellFastFood: boolean;
    storeType: number;
}

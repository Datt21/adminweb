import { Injectable } from '@angular/core';
import { Store, StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { Product } from 'src/app/core/models/product';
import { Type } from 'src/app/core/models/type';

export interface ProductState extends EntityState<Product> {
    isShowModal: boolean;
    product: Product;
    type: Type;
    isSearchPrice: boolean;
}

export function createInitialState(): ProductState {
    return {
        isShowModal: false,
        isSubmit: false,
        product: {
            id: null,
            name: '',
            productId: '',
            fastFoodCategoryId: null,
            image: '',
            description: '',
            order_number: 0,
            price: '',
            updatedAt: ''
        },
        type: {
            id: null,
            name: '',
        },
        isSearchPrice: false,
        priceProduct: null
    };
}

@Injectable()
@StoreConfig({ name: 'product' })
export class ProductStore extends EntityStore<ProductState> {

    constructor() {
        super(createInitialState());
    }
}

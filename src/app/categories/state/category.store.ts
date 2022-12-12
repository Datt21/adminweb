import { Injectable } from '@angular/core';
import { Store, StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { Category } from '../../core/models/category';
import { Product } from 'src/app/core/models/product';
import { Type } from 'src/app/core/models/type';

export interface CategoryState extends EntityState<Category> {
    isShowCategoryModal: boolean;
    isShowProductModal: boolean;
    category: Category;
    product: Product;
    type: Type;
    isSpinning: boolean;
    isSearchPrice: boolean;
    isCropImage: boolean;
}

export function createInitialState(): CategoryState {
    return {
        isShowCategoryModal: false,
        isShowProductModal: false,
        isSubmit: false,
        category: {
            id: null,
            name: '',
            image: '',
            storeType: 0,
            orderNumber: 0,
            products: []
        },
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
        isSpinning: false,
        isSearchPrice: false,
        isCropImage: true,
    };
}

@Injectable()
@StoreConfig({ name: 'category' })
export class CategoryStore extends EntityStore<CategoryState> {

    constructor() {
        super(createInitialState());
    }
}

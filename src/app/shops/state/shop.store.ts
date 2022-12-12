import { Injectable } from '@angular/core';
import { Store, StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { Shop } from 'src/app/core/models/shop';
import { Type, Types } from 'src/app/core/models/type';

export interface ShopState extends EntityState<Shop> {
    isSubmit: boolean;
    types: Type[];
    pagination: {
        total: string,
        page: number,
        size: number
    };
}

export function createInitialState(): ShopState {
    return {
        isSubmit: false,
        types: Types,
        pagination: undefined,
    };
}

@Injectable()
@StoreConfig({ name: 'shop' })
export class ShopStore extends EntityStore<ShopState> {

    constructor() {
        super(createInitialState());
    }
}

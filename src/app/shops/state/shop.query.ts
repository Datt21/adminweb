import { Injectable } from '@angular/core';
import { Query, QueryEntity } from '@datorama/akita';
import { ShopStore, ShopState } from './shop.store';

@Injectable()
export class ShopQuery extends QueryEntity<ShopState> {

    constructor(protected store: ShopStore) {
        super(store);
    }

}

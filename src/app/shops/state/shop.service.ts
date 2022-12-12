import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShopStore } from './shop.store';
import { ID } from '@datorama/akita';
import { ShopAPI } from 'src/app/core/services/shop.service';
import { Type, Types } from 'src/app/core/models/type';
import { NzModalService } from 'ng-zorro-antd';
@Injectable()
export class ShopService {
    constructor(
        private http: HttpClient,
        private shopStore: ShopStore,
        private shopAPI: ShopAPI,
        private notification: NzModalService
    ) { }

    showSuccess(title: string, content: string) {
        this.notification.success({
            nzTitle: title,
            nzContent: content,
            nzWidth: '416px',
        });
    }

    /** update checkbox for shop */
    updateShop(shop: any, input: any): void {
        this.shopAPI.update(shop.hashCode, input).subscribe((data) => {
            this.shopStore.update(shop.id, input);
            this.showSuccess('変更完了', 'FF注文受付が変更されました。');
        }, error => {
        });
    }

    /** search shop */
    searchShop(input: object): void {
        this.shopStore.update({ isSubmit: true });
        this.shopAPI.search(input).subscribe(response => {
            if (response.data.items) {
                this.shopStore.set(response.data.items);
            } else if (!response.data.items) {
                this.shopStore.set(response.data);
            }
            this.shopStore.update({pagination: response.data.pagination});
            this.shopStore.update({ isSubmit: false });
        }, error => {
            this.shopStore.update({ isSubmit: false });
        });
    }

    /** find shop */
    findShop(id: ID): Type {
        return Types.find(x => {
            return x.id === id;
        });
    }


    /** update many shop */
    updateStoreTypeShops(input: any): void {
        this.shopAPI.updateStoresType(input).subscribe(response => {
            input.stores.map(x => {
                this.shopStore.update(x.storeId, { storeType: x.storeType });
            });
            this.showSuccess('変更完了', '店舗タイプに応じた商品設定に変更しました。');
        }, error => {
        });
    }


    /** reset Store  */
    resetStore(): void {
        this.shopStore.reset();
    }
}


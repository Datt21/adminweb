import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryStore } from './category.store';
import { Category } from 'src/app/core/models/category';
import { Product } from 'src/app/core/models/product';
import { ProductAPI } from '../../core/services/product.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ID } from '@datorama/akita';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class ProductService {
    constructor(
        private categoryStore: CategoryStore,
        private http: HttpClient,
        private productAPI: ProductAPI,
        private notification: NzModalService,
    ) {
        this.categoryStore.setLoading(false);
    }

    showSuccess(title: string, content: string) {
        this.notification.success({
            nzTitle: title,
            nzContent: content,
            nzWidth: '416px',
        });
    }

    /** service for product */
    closeModal(): void {
        this.categoryStore.update({ isShowProductModal: false, product: null });
    }

    create(data: Category): void {
        this.categoryStore.update({ isShowProductModal: true, product: null, category: data, isCropImage: true });
    }

    save(input: any): void {
        this.categoryStore.update({ isSubmit: true });
        this.productAPI.create(input).subscribe((data) => {
            this.categoryStore.update(input.fastFoodCategoryId, entity => {
                return {
                    products: [...entity.products, data.data]
                };
            });
            this.categoryStore.update({ isShowProductModal: false, isSubmit: false, product: null });
            this.showSuccess('作成完了', '商品の新規作成が完了しました。');
        }, error => {
            this.categoryStore.update({ isShowProductModal: false, isSubmit: false, product: null });
        });
    }

    edit(data: Product, data2: Category): void {
        this.productAPI.find(data.id).subscribe(response => {
            this.categoryStore.update({ isShowProductModal: true, product: response.data, category: data2, isCropImage: true });
        }, error => {
        });
    }

    update(input: any, id: ID, categoryId: ID): void {
        this.categoryStore.update({ isSubmit: true });
        this.productAPI.update(id, input).subscribe((data) => {
            this.categoryStore.update(categoryId, entity => {
                return {
                    products: entity.products.map((item) => {
                        if (item.id === id) {
                            item = { ...item, ...data.data };
                        }
                        return item;
                    }),
                };
            });
            this.categoryStore.update({ isShowProductModal: false, isSubmit: false, product: null });
            this.showSuccess('編集完了', '商品の編集が完了しました。');
        }, error => {
            this.categoryStore.update({ isShowProductModal: false, isSubmit: false, product: null });
            this.categoryStore.update({ isSubmit: false });
        });
    }

    delete(id: number, categoryId: ID): void {
        this.productAPI.delete(id).subscribe(data => {
            this.categoryStore.update(categoryId, entity => {
                return {
                    products: entity.products.filter((item) => {
                        if (item.id !== id) {
                            return item;
                        }
                    }),
                };
            });
            this.showSuccess('削除完了', '商品の削除が完了しました。');
        });
    }

    get(category: Category): void {
        this.categoryStore.update({ isSpinning: true });
        this.productAPI.get(category).subscribe(response => {
            this.categoryStore.update(category.id, {
                products: response.data.map(x => {
                    return { ...x, price: '' };
                })
            });
            this.categoryStore.update({ isSpinning: false });
        }, error => {
            this.categoryStore.update({ isSpinning: false });
        });
    }

    sort(categoryWillSort: Category, newSortProducts: Product[], oldSortProducts: Product[]): void {
        const input = {
            fastfoods: [],
        };
        input.fastfoods = newSortProducts.map((x, index, arr) => {
            return {
                id: x.id,
                orderNumber: index,
            };
        });

        this.categoryStore.update(categoryWillSort.id, {products: newSortProducts});
        this.productAPI.sort(input).subscribe((response) => {
        }, error => {
                this.categoryStore.update(categoryWillSort.id, {products: oldSortProducts});
        });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryStore } from './category.store';
import { Category } from 'src/app/core/models/category';
import { CategoryAPI } from '../../core/services/category.service';
import { ID } from '@datorama/akita';
import { Types } from 'src/app/core/models/type';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class CategoryService {
    constructor(
        private categoryStore: CategoryStore,
        private http: HttpClient,
        private categoryAPI: CategoryAPI,
        private notification: NzModalService
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

    /** serice for category */
    closeModal(): void {
        this.categoryStore.update({ isShowCategoryModal: false, category: null });
    }

    create(): void {
        this.categoryStore.update({ isShowCategoryModal: true, category: null, isCropImage: true });
    }

    save(input: any): void {
        this.categoryStore.update({ isSubmit: true });
        this.categoryAPI.create(input).subscribe((data) => {
            this.categoryStore.add({ ...data.data, products: [] });
            this.categoryStore.update({ isShowCategoryModal: false, isSubmit: false, category: null });
            this.showSuccess('作成完了', 'カテゴリの新規作成が完了しました。');
        }, error => {
            this.categoryStore.update({ isShowCategoryModal: false, isSubmit: false, category: null });
        });
    }

    edit(data: Category) {
        this.categoryStore.update({ isShowCategoryModal: true, category: data, isCropImage: true });
    }

    update(id: ID, input: any): void {
        this.categoryStore.update({ isSubmit: true });
        this.categoryAPI.update(id, input).subscribe((data) => {
            this.categoryStore.update(id, input);
            this.categoryStore.update({ isShowCategoryModal: false, isSubmit: false, category: null });
            this.showSuccess('編集完了', 'カテゴリの編集が完了しました。');
        }, error => {
            this.categoryStore.update({ isShowCategoryModal: false, isSubmit: false, category: null });
        });
    }

    delete(id: number): void {
        this.categoryAPI.delete(id).subscribe(data => {
            this.categoryStore.remove(id);
            this.showSuccess('削除完了', 'カテゴリの削除が完了しました。');
        }, error => {
        });
    }

    get(storeType: number): void {
        this.categoryStore.update({isSpinning: true});
        this.categoryAPI.get(storeType).subscribe(response => {
            this.categoryStore.update({isSpinning: false});
            this.categoryStore.set(response.data.map((x) => {
                return { ...x, products: [] };
            }));
        }, error => {
            this.categoryStore.update({isSpinning: false});
        });
    }

    /** sort category */

    sort(newSortCategories: Category[], oldSortCategories: Category[]): void {
        const input = {
            categories: [],
        };
        input.categories = newSortCategories.map((x, index, arr) => {
            return {
                id: x.id,
                orderNumber: index,
            };
        });
        // change order of previous & current
        this.categoryStore.set(newSortCategories);
        this.categoryAPI.sort(input).subscribe((response) => {
        }, error => {
            this.categoryStore.set(oldSortCategories);
        });
    }

    /** update Shop type */
    setShopType(typeId: number): void {
        const shopType = Types.find(x => {
            return x.id === typeId;
        });
        this.categoryStore.update({ type: shopType });
    }

    /** reset Store  */
    resetStore(): void {
        this.categoryStore.reset();
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryQuery } from '../state/category.query';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoryService } from '../state/category.service';
import { Product } from 'src/app/core/models/product';
import { Category } from 'src/app/core/models/category';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../state/product.service';
import { ProductAPI } from 'src/app/core/services/product.service';
import { CategoryStore } from '../state/category.store';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-category-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class CategoryIndexComponent implements OnInit, OnDestroy {
    isShowModal: boolean;
    mapOfExpandData: { [key: string]: boolean } = {};
    categories: Category[];
    isSpinning$: Observable<boolean>;
    category: any;
    sortDatas: any[] = [];
    isAllowSort: boolean;

    constructor(
        private categoryQuery: CategoryQuery,
        public categoryService: CategoryService,
        public productService: ProductService,
        private activeRoute: ActivatedRoute,
        public productApi: ProductAPI,
        private categoryStore: CategoryStore,
        private modalService: NzModalService
    ) {
        this.categoryQuery.select(state => state.isShowCategoryModal).subscribe(x => this.isShowModal = x);
        this.categoryQuery.selectAll().subscribe(x => {
            this.categories = x;
            this.sortDatas = [];
            this.categories.forEach((item) => {
                this.sortDatas.push(item);
                item.products.forEach(item2 => {
                    this.sortDatas.push(item2);
                });
            });
        });
        this.isSpinning$ = this.categoryQuery.select(state => state.isSpinning);
    }

    /** */
    ngOnInit() {
        this.activeRoute.params.subscribe(routeParams => {
            this.mapOfExpandData = {};
            this.isAllowSort = false;
            this.categoryService.setShopType(+routeParams.id);
            this.categoryService.get(+routeParams.id);
        });
    }

    /** expend click table */
    collapse(category: Category, status: boolean): void {
        if (status) {
            this.productService.get(category);
        } else {
            this.categoryStore.update(category.id, {products: []});
        }
    }

    /** handle drop */
    handleDrop(event: CdkDragDrop<string[]>): void {
        const current = this.sortDatas[event.previousIndex];
        // call sortCategory
        if (current.hasOwnProperty('products')) {
            this.sortCategory(event);
        }
        // call sortProduct
        if (current.hasOwnProperty('productId')) {
            this.sortProduct(event);
        }
    }


    editProduct(product: Product, category: Category) {
        this.productService.edit(product, category);
    }

    showConfirmDeleteCategory(id) {
        this.modalService.confirm({
            nzTitle: '<span>削除確認</span>',
            nzContent: '<span>削除してもよろしいですか?</span>',
            nzCancelText: 'キャンセル',
            nzIconType: 'question-circle',
            nzOnOk: () =>  this.categoryService.delete(id),
            nzWidth: '416px',
        });
    }

    showConfirmDeleteProduct(id, fastFoodCategoryId) {
        this.modalService.confirm({
            nzTitle: '<span>削除確認</span>',
            nzContent: '<span>削除してもよろしいですか?</span>',
            nzCancelText: 'キャンセル',
            nzIconType: 'question-circle',
            nzOnOk: () =>  this.productService.delete(id, fastFoodCategoryId),
            nzWidth: '416px',
        });
    }

    /** sort Category */
    sortCategory(event): void {
        const preIndexCategory = this.sortDatas[event.previousIndex];
        const nextIndexCategory = this.sortDatas[event.currentIndex];

        this.sortDatas.splice(event.currentIndex, 0, this.sortDatas.splice(event.previousIndex, 1)[0]);
        const newSortCategories = this.sortDatas.filter(x => {
            if (x.hasOwnProperty('products')) {
                return x;
            }
        });
        const oldSortCategories = [...this.categories];
        // submit sort
        this.categoryService.sort(newSortCategories, oldSortCategories);
    }

    /** sort Product */
    sortProduct(event): void {
        const preIndexProduct = this.sortDatas[event.previousIndex];
        const nextIndexProduct = this.sortDatas[event.currentIndex];

        this.sortDatas.splice(event.currentIndex, 0, this.sortDatas.splice(event.previousIndex, 1)[0]);
        const newSortProducts = this.sortDatas.filter(x => {
            if (x.hasOwnProperty('productId') && x.fastFoodCategoryId === preIndexProduct.fastFoodCategoryId) {
                return x;
            }
        });
        const categoryWillSort = {...this.categories.find(x => {
            if (x.id === preIndexProduct.fastFoodCategoryId) {
                return x;
            }
        })};

        const oldSortProducts = [...categoryWillSort.products];
        // submit sort
        this.productService.sort(categoryWillSort, newSortProducts, oldSortProducts);
    }

    /** when destroy component reset state category */
    ngOnDestroy(): void {
        this.categoryService.resetStore();
    }
}

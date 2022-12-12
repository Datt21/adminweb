import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const categories = [
      { id: 1, name: 'John Brown', image: 'assets/product-1.png' },
      { id: 2, name: 'Jim Green', image: 'assets/product-1.png' },
      { id: 3, name: 'Joe Black', image: 'assets/product-1.png' }
    ];

    const products = [
      { id: 1, name: '1 スイーツ', image: 'assets/product-1.png', productId: 'MS0001',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 1 },
      { id: 2, name: '1 スイーツ', image: 'assets/product-1.png', productId: 'MS0002',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 1 },
      { id: 3, name: '1 スイーツ', image: 'assets/product-1.png', productId: 'MS0003',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 1 },
      { id: 4, name: '2 スイーツ', image: 'assets/product-1.png', productId: 'MS0004',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 2 },
      { id: 5, name: '2 スイーツ', image: 'assets/product-1.png', productId: 'MS0005',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 2 },
      { id: 6, name: '3 スイーツ', image: 'assets/product-1.png', productId: 'MS0006',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 3 },
      { id: 7, name: '3 スイーツ', image: 'assets/product-1.png', productId: 'MS0007',
        description: 'Hello world', createdAt: new Date('2019/5/16 00:00:00'), fastFoodCategoryId: 3 },
    ];

    const shops = [
      { id: 1, name: '千葉店', code: 'ST0001', address: 'Tỉnh Chiba, Thành phố Ichikawa 1-1-1', status: true, type: 'A' },
      { id: 2, name: '千葉店', code: 'ST0002', address: 'Tỉnh Chiba, Thành phố Ichikawa 1-1-1', status: false, type: 'B' },
      { id: 3, name: '千葉店', code: 'ST0003', address: 'Tỉnh Chiba, Thành phố Ichikawa 1-1-1', status: true, type: 'C' }
    ];

    return { categories, products, shops };
  }
  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  // genId(categories: Category[]): number {
  //   return categories.length > 0 ? Math.max(...categories.map(hero => hero.id)) + 1 : 11;
  // }
}

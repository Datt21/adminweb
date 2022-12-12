import { Injectable } from '@angular/core';
import { Query, QueryEntity } from '@datorama/akita';
import { CategoryStore, CategoryState } from './category.store';

@Injectable()
export class CategoryQuery extends QueryEntity<CategoryState> {

  constructor(protected store: CategoryStore) {
    super(store);
  }

}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ShopQuery } from '../state/shop.query';
import { ShopService } from '../state/shop.service';
@Component({
    selector: 'app-shop-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class ShopSearchComponent implements OnInit {
    isSubmit$: Observable<boolean>;
    validateForm: FormGroup;
    checkOptions: any;
    // tslint:disable-next-line: no-output-rename
    @Output('valueForm') valueForm = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private shopQuery: ShopQuery,
        private shopService: ShopService
    ) {
        this.isSubmit$ = this.shopQuery.select(state => state.isSubmit);
        this.shopQuery.select(state => state.types).subscribe(types => {
            this.checkOptions = types.map(type => {
                return {
                    id: type.id,
                    label: type.name,
                    checked: true,
                };
            });
        });

        this.validateForm = this.fb.group({
            id: [''],
            name: [''],
            storeTypes: [this.checkOptions]
        });
    }

    ngOnInit() { }

    submitForm(): void {
        // validate error
        for (const i in this.validateForm.controls) {
            if (this.validateForm.controls[i]) {
                this.validateForm.controls[i].markAsDirty();
                this.validateForm.controls[i].updateValueAndValidity();
            }
        }
        // trim space
        this.trimSpace();
        this.valueForm.emit(this.validateForm.value);
        // submit
        this.shopService.searchShop(this.validateForm.value);
    }

    /** trim space  */
    trimSpace(): void {
        this.validateForm.patchValue({
            id: this.validateForm.value.id.trim(),
            name: this.validateForm.value.name.trim(),
        });
    }
}

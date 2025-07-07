import { Component }          from '@angular/core';
import { MatIcon }            from '@angular/material/icon';
import { RouterLink }         from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';

import { PageHeaderComponent }                     from '@layout/components/page-header/page-header.component';
import { BenefitCategoryService }                  from '@modules/admin/admin/benefits/services/benefit-category.service';
import { BenefitCategoryCardComponent }            from '@modules/admin/apps/benefits/components/benefit-category-card/benefit-category-card.component';
import { AsyncPipe }                               from '@angular/common';
import { MatFormField, MatPrefix }                 from '@angular/material/form-field';
import { MatInput }                                from '@angular/material/input';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { BenefitCategoriesListComponent }          from '@modules/admin/apps/benefits/components/benefit-categories-list/benefit-categories-list.component';
import { BenefitCardComponent }                    from '@modules/admin/apps/benefits/components/benefit-card/benefit-card.component';
import { MatProgressSpinner }                      from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, takeUntil }  from 'rxjs';
import { BenefitsService }                         from '@modules/admin/admin/benefits/services/benefits.service';
import { BenefitCategory }                         from '@modules/admin/admin/benefits/models/benefit-category';
import { Benefit }                                 from '@modules/admin/admin/benefits/models/benefit';
import { SubComponent }                            from '@layout/components/sub-component/sub-component';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports: [
        PageHeaderComponent,
        TranslocoDirective,
        MatIcon,
        BenefitCategoryCardComponent,
        RouterLink,
        AsyncPipe,
        MatFormField,
        MatInput,
        MatPrefix,
        ReactiveFormsModule,
        BenefitCategoriesListComponent,
        BenefitCardComponent,
        MatProgressSpinner
    ],
    templateUrl: './list.component.html'
})
export class ListComponent extends SubComponent {
    public categories$ = this._benefitCategoryService.categories$;
    public searchControl: UntypedFormControl = new UntypedFormControl('');

    private _mostViewedCategories$: BehaviorSubject<BenefitCategory[]> = new BehaviorSubject<BenefitCategory[]>([]);
    private _mostViewedBenefits$: BehaviorSubject<Benefit[]> = new BehaviorSubject<Benefit[]>([]);

    constructor(
        private readonly _benefitCategoryService: BenefitCategoryService,
        private readonly _benefitsService: BenefitsService,
    ) {
        super();
        this._findMostViewedBenefits();
        this._findMostViewedCategories();
    }

    get mostViewedCategories() {
        return this._mostViewedCategories$.asObservable();
    }

    get mostViewedBenefits(): Observable<Benefit[]> {
        return this._mostViewedBenefits$.asObservable();
    }

    private _findMostViewedBenefits() {
        this._benefitsService.findMostViewed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (value) => this._mostViewedBenefits$.next(value)
            });
    }

    private _findMostViewedCategories() {
        this._benefitCategoryService.findMostViewed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (value) => this._mostViewedCategories$.next(value)
            });
    }
}

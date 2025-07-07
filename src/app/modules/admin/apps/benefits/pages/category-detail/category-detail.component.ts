import { Component, inject, Input, OnDestroy } from '@angular/core';
import { RouterLink }                          from '@angular/router';
import { MatIcon }                             from '@angular/material/icon';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule }           from 'ngx-skeleton-loader';
import { BenefitCategory }                   from '@modules/admin/admin/benefits/models/benefit-category';
import { AsyncPipe }                         from '@angular/common';
import { BenefitCardComponent }              from '@modules/admin/apps/benefits/components/benefit-card/benefit-card.component';
import { MatProgressSpinner }                from '@angular/material/progress-spinner';
import { Benefit }                           from '@modules/admin/admin/benefits/models/benefit';
import { Observable }                        from 'rxjs';
import { BenefitCategoriesListComponent }    from '@modules/admin/apps/benefits/components/benefit-categories-list/benefit-categories-list.component';
import { DeltaToHtmlPipe }                   from '@core/pipe/delta-to-html.pipe';
import { BenefitCategoryService }            from '@modules/admin/admin/benefits/services/benefit-category.service';

@Component({
    selector   : 'app-category-detail',
    standalone : true,
    imports: [
        TranslocoDirective,
        RouterLink,
        TranslocoPipe,
        MatIcon,
        NgxSkeletonLoaderModule,
        AsyncPipe,
        BenefitCardComponent,
        MatProgressSpinner,
        BenefitCategoriesListComponent,
        DeltaToHtmlPipe
    ],
    templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnDestroy {
    @Input('categoryId') categoryId: string;
    private readonly _benefitCategoryService: BenefitCategoryService = inject(BenefitCategoryService);
    public category$: Observable<BenefitCategory> = this._benefitCategoryService.selectedCategory$;
    public benefits$: Observable<Benefit[]> = this._benefitCategoryService.selectedCategoryBenefits$;

    ngOnDestroy() {
        console.log('ngOnDestroy');
        this._benefitCategoryService.removeSelectedCategory();
    }
}

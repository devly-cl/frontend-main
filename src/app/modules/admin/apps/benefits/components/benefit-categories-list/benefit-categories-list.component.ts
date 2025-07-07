import { Component, inject, Input }                     from '@angular/core';
import { BenefitCategoryService }                       from '@modules/admin/admin/benefits/services/benefit-category.service';
import { AsyncPipe, NgTemplateOutlet }                  from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject, firstValueFrom }              from 'rxjs';
import { BenefitCategory }                              from '@modules/admin/admin/benefits/models/benefit-category';

@Component({
    selector   : 'benefit-categories-list',
    standalone : true,
    imports: [
        AsyncPipe,
        RouterLink,
        RouterLinkActive,
        NgTemplateOutlet
    ],
    templateUrl: './benefit-categories-list.component.html'
})
export class BenefitCategoriesListComponent {
    @Input('categoryId') categoryId: string;
    private _route: ActivatedRoute = inject(ActivatedRoute);
    private _benefitCategoryService: BenefitCategoryService = inject(BenefitCategoryService);
    public categories$ = this._benefitCategoryService.categories$;

    constructor() {
        firstValueFrom(this.categories$).then((categories: BenefitCategory[]) => {
            if (this._route.snapshot.queryParams.category) {
                const selectedCategory = categories.find((category: BenefitCategory) => category.subCategories.some((subCategory: BenefitCategory) => subCategory.id === this._route.snapshot.queryParams.category));

                this.selectedCategory = {category: selectedCategory, emitEvent: false};
                this.selectSubCategory(selectedCategory.subCategories.find((subCategory: BenefitCategory) => subCategory.id === this._route.snapshot.queryParams.subCategory));
            } else if (this.categoryId) {
                this.selectedCategory = {category: categories.find((category: BenefitCategory) => category.id === this.categoryId)};
            }
        });
    }

    private _selectedCategory$: BehaviorSubject<BenefitCategory> = new BehaviorSubject<BenefitCategory>(null);

    get selectedCategory$() {
        return this._selectedCategory$.asObservable();
    }

    set selectedCategory({category, emitEvent = true}: { category: BenefitCategory, emitEvent?: boolean }) {
        if (emitEvent) {
            firstValueFrom(this._benefitCategoryService.findOne(category.id)).then();
            firstValueFrom(this._benefitCategoryService.findOneBenefits(category.id)).then();
        }
        this._selectedCategory$.next(category);
    }

    public selectSubCategory(category: BenefitCategory): void {
        firstValueFrom(this._benefitCategoryService.findOne(category.id)).then();
        firstValueFrom(this._benefitCategoryService.findOneBenefits(category.id)).then();
    }
}

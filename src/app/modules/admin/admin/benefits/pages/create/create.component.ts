import { AsyncPipe, NgClass, NgForOf }                                           from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild }     from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule }                                                 from '@angular/material/autocomplete';
import { MatButton }                                                             from '@angular/material/button';
import { MatDialog }                                                             from '@angular/material/dialog';
import { MatDivider }                                                            from '@angular/material/divider';
import { MatFormFieldModule }                                                    from '@angular/material/form-field';
import { MatInputModule }                                                        from '@angular/material/input';
import { MatSelectModule }                                                       from '@angular/material/select';

import { TranslocoDirective, TranslocoPipe }                        from '@ngneat/transloco';
import { QuillEditorComponent }                                     from 'ngx-quill';
import { BehaviorSubject, firstValueFrom, map, Subject, switchMap } from 'rxjs';

import { SIMPLE_QUILL_EDITOR_MODULES }  from '@core/constants';
import { LayoutEnum }                   from '@core/enums/layout.enum';
import { displayWithFn, filterByValue } from '@core/utils';
import { CategoryNewComponent }         from '@modules/admin/admin/benefits/dialogs/category-new/category-new.component';
import { BenefitTypeEnum }              from '@modules/admin/admin/benefits/enums/benefit-type.enum';
import { BenefitCategory }              from '@modules/admin/admin/benefits/models/benefit-category';
import { BenefitCompany }               from '@modules/admin/admin/benefits/models/benefit-company';
import { BenefitsService }              from '@modules/admin/admin/benefits/services/benefits.service';
import { BenefitCategoryService }       from '@modules/admin/admin/benefits/services/benefit-category.service';
import { BenefitCompanyService }        from '@modules/admin/admin/benefits/services/benefit-company.service';
import { BenefitMapper }                from '@modules/admin/admin/benefits/models/benefit';
import { PageDetailHeaderComponent }    from '@shared/components/page-detail-header/page-detail-header.component';
import { deltaEmptyValidator }          from '@core/validators/delta-empty.validator';

@Component({
    selector       : 'app-create',
    standalone     : true,
    imports: [
        TranslocoDirective,
        PageDetailHeaderComponent,
        TranslocoPipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        NgForOf,
        MatDivider,
        AsyncPipe,
        QuillEditorComponent,
        MatButton,
        MatSelectModule,
        NgClass
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl    : './create.component.html'
})
export class CreateComponent implements OnInit {
    @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
    @ViewChild('companyInput') companyInput: ElementRef<HTMLInputElement>;

    public form: UntypedFormGroup;
    public readonly benefitTypes = Object.values(BenefitTypeEnum);
    public readonly quillModules: any = SIMPLE_QUILL_EDITOR_MODULES;
    protected readonly displayCategoryWithFn = displayWithFn<BenefitCategory>;
    protected readonly displayCompanyWithFn = displayWithFn<BenefitCompany>;
    private _filterCategorySubject: Subject<string> = new Subject<string>();
    private _filterCompanySubject: Subject<string> = new Subject<string>();

    constructor(
        private readonly _benefitsService: BenefitsService,
        private readonly _benefitCategoryService: BenefitCategoryService,
        private readonly _benefitsCompanyService: BenefitCompanyService,
        private readonly _matDialog: MatDialog,
        private readonly _formBuilder: UntypedFormBuilder
    ) {
        this._loadForm();
    }

    private _categories$: BehaviorSubject<BenefitCategory[]> = new BehaviorSubject<BenefitCategory[]>([]);

    get categories$() {
        return this._categories$.asObservable();
    }

    private _categoriesFiltered$: BehaviorSubject<BenefitCategory[]> = new BehaviorSubject<BenefitCategory[]>([]);

    get categoriesFiltered$() {
        return this._categoriesFiltered$.asObservable();
    }

    private _companies$: BehaviorSubject<BenefitCompany[]> = new BehaviorSubject<BenefitCompany[]>([]);

    get companies$() {
        return this._companies$.asObservable();
    }

    private _companiesFiltered$: BehaviorSubject<BenefitCompany[]> = new BehaviorSubject<BenefitCompany[]>([]);

    get companiesFiltered$() {
        return this._companiesFiltered$.asObservable();
    }

    ngOnInit() {
        this._loadCategories();
        this._loadCompanies();

        this._filterCategorySubjectSub();
        this._filterCompanySubjectSub();
    }

    filter(field: 'category' | 'company', target: any) {
        console.log(field, target);
        switch (field) {
            case 'category': {
                this._filterCategorySubject.next(target.value);
                break;
            }
            case 'company': {
                this._filterCompanySubject.next(target.value);
                break;
            }
        }
    }

    onCategorySelect(category: BenefitCategory) {
        console.log(category);

        if (category.id === '') {
            console.log('Create new category');

            // remove the 'No results found' category
            this._categoriesFiltered$.next([]);
        }
    }

    onCompanySelect(company: BenefitCompany) {
        console.log(company);

        if (company.id === '') {
            console.log('Create new company');

            // remove the 'No results found' company
            this._companiesFiltered$.next([]);
        }
    }

    openCategoryDialog($event: KeyboardEvent | MouseEvent, text: string) {
        $event.preventDefault();
        console.log('Open category dialog', text);

        // remove the 'No results found' category
        this._filterCategorySubject.next('');
        this.categoryInput.nativeElement.value = '';
        console.log(this.categoryInput);

        this._matDialog.open(CategoryNewComponent, {
            panelClass: 'dialog-mobile-fullscreen',
            data      : {name: text},
            autoFocus : true
        });
    }

    onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.item(0);

        if (!file) return;

        this.form.patchValue({image: file});
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = BenefitMapper.fromForm(this.form.getRawValue());

        this._benefitsService.create(formValue)
            .subscribe((res) => {
                console.log(res);
                // this.form.reset();
            });

    }

    private _loadCategories() {
        firstValueFrom(this._benefitCategoryService.findAll(LayoutEnum.SELECTOR))
            .then((categories) => {
                this._categories$.next(categories);
                this._categoriesFiltered$.next(categories);
            });
    }

    private _loadCompanies() {
        firstValueFrom(this._benefitsCompanyService.findAll(LayoutEnum.SELECTOR))
            .then((companies) => {
                this._companies$.next(companies);
                this._companiesFiltered$.next(companies);
            });
    }

    private _filterCategorySubjectSub() {
        this._filterCategorySubject.pipe(
            switchMap((filterValue) =>
                this.categories$.pipe(map((categories) => filterByValue<BenefitCategory>(categories, filterValue, 'name')))
            )
        ).subscribe((filteredCategories) => {
            if (filteredCategories.length === 0) // @ts-ignore
                filteredCategories.push({id: '', name: 'Press <Enter> to create a new category.', disabled: true});

            this._categoriesFiltered$.next(filteredCategories);
        });
    }

    private _filterCompanySubjectSub() {
        this._filterCompanySubject.pipe(
            switchMap((filterValue) =>
                this.companies$.pipe(map((companies) => filterByValue<BenefitCompany>(companies, filterValue, 'name')))
            )
        ).subscribe((filteredCompanies) => {
            this._companiesFiltered$.next(filteredCompanies);
        });
    }

    private _loadForm() {
        this.form = this._formBuilder.group({
            name        : [ null, [ Validators.required ] ],
            description: [ null, [ Validators.required, deltaEmptyValidator() ] ],
            type        : [ null, [ Validators.required ] ],
            category    : [ null, [ Validators.required ] ],
            company     : [ null, [ Validators.required ] ],
            requirements: [ null ],
            conditions  : [ null ],
            dueDate     : [ null ],
            image       : [ null ],
        });
    }
}

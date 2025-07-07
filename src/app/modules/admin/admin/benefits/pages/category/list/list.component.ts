import { Component }                                                          from '@angular/core';
import { TranslocoDirective, TranslocoService }                               from '@ngneat/transloco';
import { PageHeaderComponent }                                                from '@layout/components/page-header/page-header.component';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef } from '@angular/material/table';
import { MatIcon }                                                            from '@angular/material/icon';
import { MatIconButton }                                                      from '@angular/material/button';
import { MatSort, MatSortHeader }                                             from '@angular/material/sort';
import { Table }                                                              from '../../../../../../../shared/components/table/table.component';
import { BenefitCategory }                                                    from '@modules/admin/admin/benefits/models/benefit-category';
import { BenefitCategoryService }                                             from '@modules/admin/admin/benefits/services/benefit-category.service';
import { AbstractListComponent }                                              from '../../../../../../../shared/components/abstracts/abstract-list.component';
import { MatTooltip }                                                         from '@angular/material/tooltip';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports: [
        TranslocoDirective,
        PageHeaderComponent,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatIcon,
        MatIconButton,
        MatSort,
        MatSortHeader,
        Table,
        MatHeaderCellDef,
        MatTooltip
    ],
    templateUrl: './list.component.html'
})
export class ListComponent extends AbstractListComponent<BenefitCategory> {
    public columns: Array<keyof BenefitCategory | string> = [ 'name', 'parent', 'active', 'order', 'actions' ];

    constructor(
        private readonly _benefitCategoryService: BenefitCategoryService,
        translationService: TranslocoService
    ) {
        super(
            _benefitCategoryService,
            _benefitCategoryService.categories$,
            {
                title  : translationService.translate('admin.benefits.category.delete.title'),
                message: translationService.translate('admin.benefits.category.delete.message'),
                hint   : {
                    color  : 'warn',
                    message: 'admin.benefits.category.delete.hint',
                },
                actions: {
                    confirm: {
                        label: translationService.translate('actions.delete'),
                    },
                    cancel : {
                        label: translationService.translate('actions.cancel'),
                    },
                },
            }
        );
    }

    edit(item: BenefitCategory): void {
        console.log('Edit item', item);
    }
}

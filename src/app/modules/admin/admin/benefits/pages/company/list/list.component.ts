import { ChangeDetectionStrategy, Component }                                 from '@angular/core';
import { TranslocoDirective, TranslocoService }                               from '@ngneat/transloco';
import { PageHeaderComponent }                                                from '@layout/components/page-header/page-header.component';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef } from '@angular/material/table';
import { MatIcon }                                                            from '@angular/material/icon';
import { MatIconButton }                                                      from '@angular/material/button';
import { MatSort, MatSortHeader }                                             from '@angular/material/sort';
import { Table }                                                              from '../../../../../../../shared/components/table/table.component';
import { BenefitCompany }                                                     from '@modules/admin/admin/benefits/models/benefit-company';
import { BenefitCompanyService }                                              from '@modules/admin/admin/benefits/services/benefit-company.service';
import { AbstractListComponent }                                              from '../../../../../../../shared/components/abstracts/abstract-list.component';
import { MatTooltip }                                                         from '@angular/material/tooltip';

@Component({
    selector       : 'app-list',
    standalone     : true,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    templateUrl    : './list.component.html'
})
export class ListComponent extends AbstractListComponent<BenefitCompany> {
    public columns: Array<keyof BenefitCompany | string> = [ 'name', 'actions' ];

    constructor(
        private readonly _benefitCompanyService: BenefitCompanyService,
        readonly translationService: TranslocoService
    ) {
        super(
            _benefitCompanyService,
            _benefitCompanyService.companies$,
            {
                title  : translationService.translate('admin.benefits.company.delete.title'),
                message: translationService.translate('admin.benefits.company.delete.message'),
                hint   : {
                    color  : 'warn',
                    message: translationService.translate('admin.benefits.company.delete.hint'),
                },
                actions: {
                    confirm: {
                        label: translationService.translate('actions.delete'),
                    },
                    cancel : {
                        label: translationService.translate('actions.cancel'),
                    }
                },
            }
        );
    }

    edit(item: BenefitCompany) {
        console.log('Edit item', item);
    }
}

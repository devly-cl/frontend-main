import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort, MatSortHeader, Sort }                                               from '@angular/material/sort';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef }         from '@angular/material/table';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { lastValueFrom, Observable }            from 'rxjs';

import { trackByFn }                            from '@libs/ui/utils/utils';
import { Benefit }                              from '@modules/admin/admin/benefits/models/benefit';
import { Table }                                from '../../../../../../shared/components/table/table.component';
import { MatIcon }                              from '@angular/material/icon';
import { MatIconButton }                        from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FuseConfirmationService }              from '../../../../../../../@fuse/services/confirmation';
import { BenefitsService }                      from '@modules/admin/admin/benefits/services/benefits.service';

@Component({
    selector       : 'benefit-table',
    standalone     : true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        Table,
        TranslocoDirective,
        MatColumnDef,
        MatSort,
        MatHeaderCellDef,
        MatHeaderCell,
        MatCellDef,
        MatCell,
        MatSortHeader,
        MatIcon,
        MatIconButton,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem
    ],
    templateUrl    : './benefits-table.component.html',
    styles         : [ `:host {
    width: 100%;
  }` ]
})
export class BenefitsTableComponent {
    @Input('benefits') benefits$!: Observable<Benefit[]>;
    @Input() loading: boolean = false;
    @Output() readonly pageChange = new EventEmitter();
    @Output() readonly sortChange = new EventEmitter<Sort>();
    @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

    columns: string[] = [ 'title', 'type', 'category', 'company', 'discountsCount', 'actions' ];

    protected readonly trackByFn = trackByFn;

    constructor(
        private readonly _confirmationService: FuseConfirmationService,
        private readonly _translateService: TranslocoService,
        private readonly _benefitService: BenefitsService
    ) {}

    openActions({$event, row}: { $event: MouseEvent, row: Benefit }) {
        $event.preventDefault();
        console.log('Action', row);
    }

    delete(benefit: Benefit) {
        const confirmation = this._confirmationService.open({
            title  : this._translateService.translate('admin.benefits.delete.title'),
            message: this._translateService.translate('admin.benefits.delete.message'),
            actions: {
                confirm: {
                    label: this._translateService.translate('admin.benefits.delete.delete'),
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            console.log('Result', result);
            if (result === 'confirmed') {
                lastValueFrom(this._benefitService.delete(benefit.id));
            }
        });
    }
}

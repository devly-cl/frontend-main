import { Component } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';
import { mergeMap }           from 'rxjs';
import { Notyf }              from 'notyf';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageHeaderComponent }     from '@layout/components/page-header/page-header.component';
import { BenefitsTableComponent }  from '@modules/admin/admin/benefits/components/benefits-table/benefits-table.component';
import { BenefitsService }         from '@modules/admin/admin/benefits/services/benefits.service';
import { Benefit }                 from '@modules/admin/admin/benefits/models/benefit';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports: [
        PageHeaderComponent,
        TranslocoDirective,
        BenefitsTableComponent,
    ],
    templateUrl: './list.component.html'
})
export class ListComponent {
    public benefits$ = this._benefitsService.benefits$;
    private _notyf = new Notyf();

    constructor(
        private readonly _fuseConfirmationService: FuseConfirmationService,
        private readonly _benefitsService: BenefitsService
    ) {}

    edit(benefit: Benefit) {
        console.log('Edit benefit', benefit);
    }

    delete(benefit: Benefit) {
        console.log('Delete benefit', benefit);
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete benefit',
            message:
                'Are you sure you want to delete the benefit? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed()
            .pipe(
                mergeMap((result) => {
                    // If the confirm button pressed...
                    if (result === 'confirmed') {
                        // Delete the album
                        return this._benefitsService.delete(benefit.id);
                    }
                    return [];
                })
            )
            .subscribe({
                next : () => {
                    this._notyf.success('Album deleted');
                },
                error: (error) => {
                    console.error('Delete album error', error);
                    this._notyf.error('Error deleting album');
                }
            });
    }

    pageChange(event: any) {
        console.log('Page change', event);
    }
}

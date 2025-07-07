import { Component }  from '@angular/core';
import { MatIcon }    from '@angular/material/icon';
import { MatDialog }  from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { mergeMap, take }                    from 'rxjs';
import { Notyf }                             from 'notyf';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageHeaderComponent }     from '@layout/components/page-header/page-header.component';
import { IEvent }                  from '@modules/admin/home/interface/event.interface';
import { EventsTableComponent }    from '../../components/events-table/events-table.component';
import { EventsService }           from '../../events.service';
import { NewOrEditComponent }      from '../../dialogs/new-or-edit/new-or-edit.component';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports    : [
        EventsTableComponent,
        MatIcon,
        MatTooltip,
        PageHeaderComponent,
        TranslocoDirective,
        TranslocoPipe,

    ],
    templateUrl: './list.component.html',
})
export class ListComponent {
    public events$ = this._eventsService.events$;
    private _notyf = new Notyf();

    constructor(
        private readonly _fuseConfirmationService: FuseConfirmationService,
        private readonly _eventsService: EventsService,
        private readonly _matDialog: MatDialog
    ) {}

    openNewEventDialog() {
        this._matDialog.open(NewOrEditComponent, {
            panelClass: 'dialog-mobile-fullscreen',
        });
    }

    editEvent(event: IEvent) {
        console.log('Edit event', event);
        this._eventsService
            .getEvent(event.id)
            .pipe(take(1))
            .subscribe((eventData) => {
                this._matDialog.open(NewOrEditComponent, {
                    panelClass: 'dialog-mobile-fullscreen',
                    data      : {event: eventData},
                });
            });
    }

    deleteEvent(event: IEvent) {
        console.log('Delete event', event);
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete event',
            message: 'Are you sure you want to delete the event? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation
            .afterClosed()
            .pipe(
                mergeMap((result) => {
                    // If the confirm button pressed...
                    if (result === 'confirmed') {
                        // Delete the event
                        return this._eventsService.deleteEvent(event.id);
                    }
                    return [];
                })
            )
            .subscribe({
                next : () => {
                    this._notyf.success('Event deleted');
                },
                error: (error) => {
                    console.error('Delete event error', error);
                    this._notyf.error('Error deleting event');
                },
            });
    }

    pageChange(event: any) {
        console.log('Page change', event);
    }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output }                                                                                          from '@angular/core';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader, Sort }                                                                                                                       from '@angular/material/sort';
import { MatIconAnchor, MatIconButton }                                                                                                                       from '@angular/material/button';
import { MatIcon }                                                                                                                                            from '@angular/material/icon';
import { MatTooltip }                                                                                                                                         from '@angular/material/tooltip';

import { Observable, Subject, takeUntil } from 'rxjs';
import { TranslocoDirective }             from '@ngneat/transloco';

import { DEFAULT_DATETIME_TIME_OPTIONS } from '@core/constants';
import { trackByFn }                     from '@libs/ui/utils/utils';
import { IEvent }                        from '@modules/admin/home/interface/event.interface';

@Component({
    selector   : 'events-table',
    standalone : true,
    imports: [
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatIconAnchor,
        MatIconButton,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        MatTooltip,
        TranslocoDirective
    ],
    templateUrl: './events-table.component.html'
})
export class EventsTableComponent implements OnInit, OnDestroy {
    @Input('events') events$!: Observable<IEvent[]>;
    @Input() loading: boolean = false;
    @Output() readonly pageChange = new EventEmitter();
    @Output() readonly sortChange = new EventEmitter<Sort>();
    @Output() readonly deleteEvent = new EventEmitter();
    @Output() readonly editEvent = new EventEmitter();
    @Output() readonly viewEvent = new EventEmitter();

    eventsDataSource: MatTableDataSource<IEvent> = new MatTableDataSource();
    eventsTableColumns: string[] = [ 'title', 'location', 'startDate', 'endDate', 'actions' ];

    protected readonly trackByFn = trackByFn;
    protected readonly DEFAULT_DATETIME_TIME_OPTIONS = DEFAULT_DATETIME_TIME_OPTIONS;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    ngOnInit() {
        this.events$?.pipe(takeUntil(this._unsubscribeAll)).subscribe((events) => {
            this.eventsDataSource.data = events;
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}

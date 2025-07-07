import { Component, OnInit }            from '@angular/core';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { MatDialog }                    from '@angular/material/dialog';
import { MatFormFieldModule }           from '@angular/material/form-field';
import { MatIcon }                      from '@angular/material/icon';
import { MatInputModule }               from '@angular/material/input';
import { MatTooltip }                   from '@angular/material/tooltip';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Notyf }                                from 'notyf';

import { FuseConfirmationService }                                                      from '@fuse/services/confirmation';
import { PageHeaderComponent }                                                          from '@layout/components/page-header/page-header.component';
import { NewNewsComponent }                                                             from '@modules/admin/admin/news/dialogs/new-news/new-news.component';
import { Table }                                                                        from '../../../../../../shared/components/table/table.component';
import { BehaviorSubject, debounceTime, distinctUntilChanged, mergeMap, of, switchMap } from 'rxjs';
import { INews }                                                                        from '@modules/admin/news/domain/interfaces/news.interface';
import { Pageable }                                                                     from '@core/interfaces/pageable';
import { takeUntilDestroyed }                                                           from '@angular/core/rxjs-interop';
import { DatePipe }                                                                     from '@angular/common';
import { NewsService }                                                                  from '@modules/admin/admin/news/news.service';
import { MatTableModule }                                                               from '@angular/material/table';
import { MatSort, MatSortHeader }                                                       from '@angular/material/sort';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators }                    from '@angular/forms';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports: [
        PageHeaderComponent,
        TranslocoDirective,
        MatIcon,
        MatIconAnchor,
        MatTooltip,
        MatFormFieldModule,
        MatIconButton,
        MatInputModule,
        MatTableModule,
        Table,
        DatePipe,
        MatSortHeader,
        MatSort,
        ReactiveFormsModule,
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    public news$: BehaviorSubject<INews[]> = new BehaviorSubject<INews[]>(null);
    public pageable$: BehaviorSubject<Pageable> = new BehaviorSubject<Pageable>(null);
    public readonly displayedColumns: string[] = [ 'title', 'cover', 'publishedAt', 'actions' ];
    public searchControl = new FormControl(undefined, [ Validators.minLength(3), Validators.maxLength(100) ]);
    private _notyf = new Notyf();

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _fuseConfirmationService: FuseConfirmationService,
        private readonly _newsService: NewsService,
        private readonly _translationService: TranslocoService,
        private readonly _matDialog: MatDialog,
    ) {
        this._subscribeToSearchControl();
        this._newsService.newsPage
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: (page) => {
                    if (page) {
                        this.news$.next(page.content);
                        this.pageable$.next(page.pageable);
                    }
                }
            });
    }

    ngOnInit() {}

    openNewDialog(): void {
        this._matDialog.open(NewNewsComponent, {
            panelClass  : 'dialog-mobile-fullscreen',
            autoFocus   : false,
            disableClose: true,
        });
    }

    openDeleteDialog(news: INews): void {
        const confirmation = this._fuseConfirmationService.open({
            title  : this._translationService.translate('admin.news.delete.title'),
            message: this._translationService.translate('admin.news.delete.message'),
            actions: {
                confirm: {
                    label: this._translationService.translate('admin.news.delete.delete'),
                },
                cancel : {
                    label: this._translationService.translate('admin.news.delete.cancel'),
                }
            },
        });

        confirmation.afterClosed()
            .pipe(
                mergeMap((result) => {
                    // If the confirm button pressed...
                    if (result === 'confirmed') {
                        // Delete the news
                        return this._newsService.delete(news.id);
                    }
                    return [];
                })
            )
            .subscribe();
    }

    private _subscribeToSearchControl() {
        this.searchControl.valueChanges
            .pipe(
                takeUntilDestroyed(),
                debounceTime(1000),
                distinctUntilChanged(),
                switchMap((value) => {
                    value = value.trim();
                    if (!value) return this._newsService.getNews({});
                    else if (value.length >= 3 && value.length < 100) return this._newsService.getNews({query: {headline: value}});
                    else return of('invalid');
                })
            )
            .subscribe();
    }
}

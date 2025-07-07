import { AsyncPipe }                                                     from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink }                                                    from '@angular/router';
import { MatIcon }                                                       from '@angular/material/icon';

import { TranslocoDirective }         from '@ngneat/transloco';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FuseMasonryComponent }       from '../../../../../../../@fuse/components/masonry';
import { FuseMediaWatcherService }    from '../../../../../../../@fuse/services/media-watcher';
import { PageHeaderComponent }        from '@layout/components/page-header/page-header.component';
import { SubComponent }               from '@layout/components/sub-component/sub-component';
import { trackByFn }                  from '@libs/ui/utils/utils';
import { HlmSkeletonComponent }       from '@libs/ui/ui-skeleton-helm/src';
import { IAlbum }                     from '@modules/admin/apps/albums/interfaces/album.interface';
import { AlbumCardComponent }         from '@modules/admin/apps/albums/components/album-card/album-card.component';
import { AlbumService }               from '@modules/admin/apps/albums/album.service';

@Component({
    selector       : 'app-albums-list',
    standalone     : true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ TranslocoDirective, PageHeaderComponent, MatIcon, RouterLink, AlbumCardComponent, AsyncPipe, FuseMasonryComponent, HlmSkeletonComponent ],
    templateUrl    : './list.component.html'
})
export class ListComponent extends SubComponent implements OnInit {
    albums$: BehaviorSubject<IAlbum[]>;
    columns: number = 4;
    protected readonly trackByFn = trackByFn;

    constructor(
        private readonly _cdr: ChangeDetectorRef,
        private readonly _albumService: AlbumService,
        private readonly _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
        super();
        this.albums$ = this._albumService.albums$;
    }

    ngOnInit() {
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if (matchingAliases.includes('xl')) {
                    this.columns = 3;
                } else if (matchingAliases.includes('lg')) {
                    this.columns = 3;
                } else if (matchingAliases.includes('md')) {
                    this.columns = 3;
                } else if (matchingAliases.includes('sm')) {
                    this.columns = 2;
                } else {
                    this.columns = 1;
                }

                this._cdr.detectChanges();
            });
    }
}

import { Component }     from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog }     from '@angular/material/dialog';
import { MatIcon }       from '@angular/material/icon';
import { MatTooltip }    from '@angular/material/tooltip';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageHeaderComponent }     from '@layout/components/page-header/page-header.component';
import { AlbumsService }           from '@modules/admin/admin/albums/albums.service';
import { AlbumsTableComponent }    from '@modules/admin/admin/albums/components/albums-table/albums-table.component';
import { NewOrEditComponent }      from '@modules/admin/admin/albums/dialogs/new-or-edit/new-or-edit.component';
import { IAlbum }                  from '@modules/admin/apps/albums/interfaces/album.interface';
import { mergeMap }                from 'rxjs';
import { Notyf }                   from 'notyf';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports: [
        PageHeaderComponent,
        TranslocoDirective,
        AlbumsTableComponent,
        MatIcon,
        MatTooltip,
        TranslocoPipe,
        MatIconButton
    ],
    templateUrl: './list.component.html'
})
export class ListComponent {
    public albums$ = this._albumsService.albums$;
    private _notyf = new Notyf();

    constructor(
        private readonly _fuseConfirmationService: FuseConfirmationService,
        private readonly _albumsService: AlbumsService,
        private readonly _matDialog: MatDialog
    ) {}

    openNewAlbumDialog() {
        this._matDialog.open(NewOrEditComponent, {
            panelClass: 'dialog-mobile-fullscreen',
        });
    }

    editAlbum(album: IAlbum) {
        console.log('Edit album', album);
    }

    deleteAlbum(album: IAlbum) {
        console.log('Delete album', album);
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete album',
            message:
                'Are you sure you want to delete the album? This action cannot be undone.',
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
                        return this._albumsService.deleteAlbum(album.id);
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

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, NgIf }                            from '@angular/common';
import { MatIcon }                                   from '@angular/material/icon';

import { IAlbum }             from '@modules/admin/apps/albums/interfaces/album.interface';
import { ImgLoaderDirective } from '@layout/directives/img-loader.directive';

@Component({
    selector       : 'album-card',
    standalone     : true,
    imports        : [
        NgIf,
        MatIcon,
        DatePipe,
        ImgLoaderDirective
    ],
    templateUrl    : './album-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumCardComponent {
    @Input() album: IAlbum;
    @Input() index: number;
}

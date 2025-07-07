import { Component, Input }    from '@angular/core';
import { FuseCardComponent }   from '../../../../../../@fuse/components/card';
import { NgIf, UpperCasePipe } from '@angular/common';
import { RouterLink }          from '@angular/router';
import { relativeTime }        from '@core/utils';
import { INews }               from '@modules/admin/news/domain/interfaces/news.interface';
import { MatIcon }             from '@angular/material/icon';
import { MatTooltip }          from '@angular/material/tooltip';

@Component({
    selector   : 'news-card',
    standalone : true,
    imports    : [
        FuseCardComponent,
        UpperCasePipe,
        RouterLink,
        NgIf,
        MatIcon,
        MatTooltip
    ],
    templateUrl: './news-card.component.html'
})
export class NewsCardComponent {
    @Input() useRouter: boolean = true;
    @Input() actionText: string;
    @Input() news: INews;
    @Input() index: number;
    @Input() externalLogo: string;

    protected readonly relativeTime = relativeTime;
}

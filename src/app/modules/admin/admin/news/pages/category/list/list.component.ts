import { AsyncPipe }           from '@angular/common';
import { Component }           from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton }       from '@angular/material/button';
import { MatIcon }             from '@angular/material/icon';
import { MatTooltip }          from '@angular/material/tooltip';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { PageHeaderComponent } from '@layout/components/page-header/page-header.component';
import { trackByFn }           from '@libs/ui/utils/utils';
import { NewsService }         from '@modules/admin/admin/news/news.service';
import { INewsCategory }       from '@modules/admin/news/domain/interfaces/category.interface';
import { lastValueFrom }       from 'rxjs';

@Component({
    selector   : 'app-list',
    standalone : true,
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        MatIcon,
        MatIconButton,
        AsyncPipe,
        MatTooltip,
        TranslocoPipe,
        PageHeaderComponent
    ],
    templateUrl: './list.component.html'
})
export class ListComponent {
    categories$ = this._newsService.categories$;

    protected readonly trackByFn = trackByFn;

    constructor(
        private readonly _newsService: NewsService
    ) {}

    delete(category: INewsCategory) {
        console.log('Deleting category:', category);
        lastValueFrom(this._newsService.deleteCategory(category.id));
    }
}

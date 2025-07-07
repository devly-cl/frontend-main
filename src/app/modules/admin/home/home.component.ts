import { CurrencyPipe, DatePipe, NgIf, UpperCasePipe }                         from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { MatAnchor, MatButton }                                                from '@angular/material/button';
import { MatIcon }                                                             from '@angular/material/icon';
import { MatProgressBar }                                                      from '@angular/material/progress-bar';
import { ActivatedRoute, RouterLink }                                          from '@angular/router';

import { TranslocoDirective }  from '@ngneat/transloco';
import Splide                  from '@splidejs/splide';
import { relativeTime }        from '@core/utils';
import { FuseCardComponent }   from '@fuse/components/card';
import { INews }               from '@modules/admin/news/domain/interfaces/news.interface';
import { IUser }               from '@modules/admin/user/profile/interfaces/user.interface';
import { IEconomicIndicator }  from '@modules/admin/home/interface/economic-indicator.interface';
import { ShortcutsComponent }  from '@modules/admin/home/components/shortcuts/shortcuts.component';
import { CalendarComponent }   from '@modules/admin/home/components/calendar/calendar.component';
import { BgPatternsComponent } from '@shared/components/bg-patterns/bg-patterns.component';
import { MatDivider }          from '@angular/material/divider';
import { NoticesComponent }    from '@modules/admin/home/components/notices/notices.component';

@Component({
    selector     : 'home',
    standalone   : true,
    templateUrl  : './home.component.html',
    schemas      : [ CUSTOM_ELEMENTS_SCHEMA ],
    encapsulation: ViewEncapsulation.None,
    imports: [
        TranslocoDirective,
        MatIcon,
        MatButton,
        FuseCardComponent,
        MatAnchor,
        RouterLink,
        DatePipe,
        CurrencyPipe,
        NgIf,
        ShortcutsComponent,
        MatProgressBar,
        CalendarComponent,
        UpperCasePipe,
        BgPatternsComponent,
        MatDivider,
        NoticesComponent
    ],
})
export class HomeComponent implements AfterViewInit {
    user: IUser;
    highlightedNews: INews[];
    economicIndicators: IEconomicIndicator;
    protected readonly relativeTime = relativeTime;

    constructor(private readonly route: ActivatedRoute) {
        this.user = this.route.snapshot.data.user;
        this.highlightedNews = this.route.snapshot.data.highlightedNews;
        this.economicIndicators = this.route.snapshot.data.economicIndicators;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.highlightedNews?.length > 0) {
                new Splide('#highlighted_news', {
                    type        : 'loop',
                    gap         : '5rem',
                    focus       : 'center',
                    autoplay    : true,
                    pagination  : true,
                    lazyLoad    : 'nearby',
                    pauseOnHover: true,
                    perPage     : 3,
                    perMove     : 1,
                    breakpoints : {
                        640 : {
                            perPage: 1, arrows: false
                        },
                        768 : {
                            perPage: 2,
                            gap    : '0rem'
                        },
                        1024: {
                            perPage: 2,
                            gap    : '0rem'
                        }
                    }
                }).mount();
            }
        }, 0);
    }
}

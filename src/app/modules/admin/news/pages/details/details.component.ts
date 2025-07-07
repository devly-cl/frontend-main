import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule }                                                                   from '@angular/common';
import { MatButtonModule }                                                                from '@angular/material/button';
import { MatDividerModule }                                                               from '@angular/material/divider';
import { MatIconModule }                                                                  from '@angular/material/icon';
import { MatInputModule }                                                                 from '@angular/material/input';
import { MatTooltipModule }                                                               from '@angular/material/tooltip';
import { ActivatedRoute }                                                                 from '@angular/router';

import { TranslocoDirective }                       from '@ngneat/transloco';
import { LightgalleryModule }                       from 'lightgallery/angular';
import { SwiperOptions }                            from 'swiper/types';
import { A11y, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperDirective }                          from '@core/directives/swiper/swiper.directive';
import { UserService }                              from '@core/user/user.service';

import { INews }                     from '../../domain/interfaces/news.interface';
import { LightGallery }              from 'lightgallery/lightgallery';
import lightGallery                  from 'lightgallery';
import { QuillViewComponent }        from 'ngx-quill';
import { PageDetailHeaderComponent } from '@shared/components/page-detail-header/page-detail-header.component';

@Component({
    selector     : 'app-single-news',
    standalone   : true,
    imports: [ CommonModule, MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule, MatInputModule, SwiperDirective, TranslocoDirective, LightgalleryModule, QuillViewComponent, PageDetailHeaderComponent ],
    encapsulation: ViewEncapsulation.None,
    templateUrl  : './details.component.html',
    schemas      : [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DetailsComponent implements AfterViewInit {
    @ViewChild('lightGallery') lightGallery: { _elementRef: { nativeElement: any; }; };
    inlineGallery: LightGallery;
    news: INews;
    settings = {};

    public config: SwiperOptions = {
        modules       : [ Navigation, Pagination, A11y, Mousewheel ],
        autoHeight    : false,
        navigation    : true,
        loop          : true,
        pagination    : {clickable: false, dynamicBullets: true},
        slidesPerView : 1,
        centeredSlides: true,
        breakpoints   : {
            400: {
                slidesPerView : 1,
                centeredSlides: true
            },
        }
    };

    constructor(
        private readonly route: ActivatedRoute,
        public readonly userService: UserService
    ) {
        this.news = this.route.snapshot.data.news;
    }

    ngAfterViewInit() {
        const lgContainer = this.lightGallery._elementRef.nativeElement;

        const items = [];

        if (this.news.portraitImage)
            items.push({
                src     : this.news.portraitImage.fileUrl,
                thumb   : this.news.portraitImage.fileUrl,
                download: this.news.portraitImage.name,
                subHtml : `<div class="lightGallery-captions">
                <h4>${ this.news.portraitImage.name }</h4>
            </div>`
            });

        if (this.news.images?.length > 0)
            items.push(
                ...this.news.images?.map((image) => ({
                    src     : image.fileUrl,
                    thumb   : image.fileUrl,
                    download: image.name,
                    subHtml : `<div class="lightGallery-captions">
                <h4>${ image.name }</h4>
                <p>Description of the slide 1</p>
            </div>`
                }))
            );

        this.inlineGallery = lightGallery(lgContainer, {
            loop      : true,
            actualSize: true,
            dynamic   : true,
            // Turn off hash plugin in case if you are using it
            // as we don't want to change the url on slide change
            hash: false,
            // Do not allow users to close the gallery
            closable        : true,
            appendSubHtmlTo : '.lg-item',
            dynamicEl       : [ ...items ],
            autoplay        : true,
            autoplayControls: true
        });
    }

    openGallery(index) {
        this.inlineGallery.openGallery(index);
    }
}

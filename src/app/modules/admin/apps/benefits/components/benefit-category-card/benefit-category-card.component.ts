import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink }                                from '@angular/router';

import { FuseCardComponent } from '@fuse/components/card';
import { BenefitCategory }   from '@modules/admin/admin/benefits/models/benefit-category';
import { DeltaToHtmlPipe }   from '@core/pipe/delta-to-html.pipe';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        FuseCardComponent,
        DeltaToHtmlPipe
    ],
    selector       : 'benefit-category-card',
    standalone     : true,
    templateUrl    : './benefit-category-card.component.html'
})
export class BenefitCategoryCardComponent {
    @Input() category: BenefitCategory;
}

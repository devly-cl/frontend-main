import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UpperCasePipe }                             from '@angular/common';

import { FuseCardComponent } from '@fuse/components/card';
import { Benefit }           from '@modules/admin/admin/benefits/models/benefit';
import { DeltaToHtmlPipe }   from '@core/pipe/delta-to-html.pipe';

@Component({
    selector       : 'benefit-card',
    standalone     : true,
    imports: [
        FuseCardComponent,
        UpperCasePipe,
        DeltaToHtmlPipe
    ],
    templateUrl    : './benefit-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenefitCardComponent {
    @Input() benefit!: Benefit;
    @Input() index: number = 0;
}

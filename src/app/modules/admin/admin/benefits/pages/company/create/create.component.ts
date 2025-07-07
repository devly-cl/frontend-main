import { Component }                                    from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageDetailHeaderComponent }                    from '../../../../../../../shared/components/page-detail-header/page-detail-header.component';
import { TranslocoDirective, TranslocoPipe }            from '@ngneat/transloco';
import { SIMPLE_QUILL_EDITOR_MODULES }                  from '@core/constants';
import { MatButton }                                    from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel }    from '@angular/material/form-field';
import { MatInput }                                     from '@angular/material/input';
import { QuillEditorComponent }                         from 'ngx-quill';
import { AbstractCreateComponent }                      from '../../../../../../../shared/components/abstracts/abstract-create.component';
import { BenefitCompany }                               from '@modules/admin/admin/benefits/models/benefit-company';
import { BenefitCompanyService }                        from '@modules/admin/admin/benefits/services/benefit-company.service';

@Component({
    selector   : 'app-create',
    standalone : true,
    imports: [
        FormsModule,
        PageDetailHeaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        MatButton,
        MatError,
        MatFormField,
        MatHint,
        MatInput,
        MatLabel,
        QuillEditorComponent,
        ReactiveFormsModule
    ],
    templateUrl: './create.component.html'
})
export class CreateComponent extends AbstractCreateComponent<BenefitCompany> {
    protected readonly quillModules = SIMPLE_QUILL_EDITOR_MODULES;

    constructor(
        private readonly _benefitCompanyService: BenefitCompanyService,
    ) {
        super(
            _benefitCompanyService,
            'admin/benefits/company',
        );
    }

    override _initForm() {
        return this.formBuilder.group({
            description: [ null, [ Validators.required, Validators.minLength(3) ] ],
            name       : [ null, [ Validators.required, Validators.minLength(3) ] ],
            image      : [ null, [ Validators.required ] ],
        });
    }

    onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.item(0);

        if (!file) return;

        this.form.patchValue({image: file});
    }
}

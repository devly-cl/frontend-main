import { CdkTextareaAutosize }                                                                from '@angular/cdk/text-field';
import { Component, ElementRef, ViewChild }                                                   from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton }                                                                          from '@angular/material/button';
import { MatFormFieldModule, MatLabel, MatPrefix }                                            from '@angular/material/form-field';
import { MatIcon }                                                                            from '@angular/material/icon';
import { MatInput }                                                                           from '@angular/material/input';
import { MatProgressSpinner }                                                                 from '@angular/material/progress-spinner';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { fuseAnimations }      from '@fuse/animations';
import { PageHeaderComponent } from '@layout/components/page-header/page-header.component';
import { trackByFn }           from '@libs/ui/utils/utils';
import { NewsService }         from '@modules/admin/admin/news/news.service';
import { lastValueFrom }       from 'rxjs';

@Component({
    selector   : 'app-create',
    standalone : true,
    imports: [
        FormsModule,
        MatButton,
        MatFormFieldModule,
        MatIcon,
        MatInput,
        MatLabel,
        MatPrefix,
        PageHeaderComponent,
        TranslocoDirective,
        ReactiveFormsModule,
        CdkTextareaAutosize,
        TranslocoPipe,
        MatProgressSpinner
    ],
    animations : fuseAnimations,
    templateUrl: './create.component.html'
})
export class CreateComponent {
    @ViewChild('formElement') formElement: ElementRef<HTMLFormElement>;

    form: UntypedFormGroup;

    protected readonly trackByFn = trackByFn;

    constructor(
        private readonly _fb: UntypedFormBuilder,
        private readonly _newsService: NewsService
    ) {
        this.form = this._fb.group({
            name       : [ undefined, Validators.required ],
            description: [ undefined, [ Validators.required, Validators.minLength(10) ] ],
        });
    }

    submit() {
        if (this.form.invalid) return;

        this.form.disable();

        lastValueFrom(this._newsService.postCategory(this.form.getRawValue()))
            .then(() => {
                this.form.enable();
                this.formElement.nativeElement.reset();
            })
            .catch(() => this.form.enable());
    }
}

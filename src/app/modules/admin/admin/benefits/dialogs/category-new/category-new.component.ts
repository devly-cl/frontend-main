import { ChangeDetectionStrategy, Component, Inject }                            from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef }                                         from '@angular/material/dialog';
import { IAlbum }                                                                from '@modules/admin/apps/albums/interfaces/album.interface';
import { TranslocoDirective, TranslocoService }                                  from '@ngneat/transloco';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton, MatIconButton }                                              from '@angular/material/button';
import { MatIcon }                                                               from '@angular/material/icon';
import { MatFormFieldModule }                                                    from '@angular/material/form-field';
import { CdkTextareaAutosize }                                                   from '@angular/cdk/text-field';
import { MatInputModule }                                                        from '@angular/material/input';
import { DropzoneMaterialModule }                                                from '@ngx-dropzone/material';
import { DropzoneCdkModule }                                                     from '@ngx-dropzone/cdk';
import { MatChipsModule }                                                        from '@angular/material/chips';
import { MatProgressSpinner }                                                    from '@angular/material/progress-spinner';
import { NgIf }                                                                  from '@angular/common';
import { Notyf }                                                                 from 'notyf';

@Component({
    selector       : 'app-category-new',
    standalone     : true,
    imports: [
        TranslocoDirective,
        MatIconButton,
        MatIcon,
        ReactiveFormsModule,
        MatFormFieldModule,
        CdkTextareaAutosize,
        MatInputModule,
        DropzoneCdkModule,
        DropzoneMaterialModule,
        MatChipsModule,
        MatButton,
        MatProgressSpinner,
        NgIf
    ],
    templateUrl    : './category-new.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryNewComponent {
    form: UntypedFormGroup;
    notyf = new Notyf();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { album: IAlbum },
        public readonly _matDialogRef: MatDialogRef<CategoryNewComponent>,
        private readonly _translocoService: TranslocoService,
        private readonly _formBuilder: UntypedFormBuilder
    ) {
        this._loadForm();
    }

    save() {
        if (this.form.invalid) {
            this.notyf.error(this._translocoService.translate('admin.benefits.category.messages.invalidForm'));
            return;
        }
    }

    private _loadForm() {
        this.form = this._formBuilder.group({
            name       : [ null, [ Validators.required ] ],
            description: [ null, [ Validators.required ] ],
            icon       : [ null ],
            image      : [ null ]
        });
    }
}

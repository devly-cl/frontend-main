import { Component }                                                             from '@angular/core';
import { PageHeaderComponent }                                                   from '@layout/components/page-header/page-header.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService }                   from '@ngneat/transloco';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule }                                                    from '@angular/material/form-field';
import { MatInput }                                                              from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle }                from '@angular/material/datepicker';
import { AsyncPipe, NgIf }                                                       from '@angular/common';
import { MatButton }                                                             from '@angular/material/button';
import { MatOption }                                                             from '@angular/material/core';
import { MatSelect }                                                             from '@angular/material/select';
import { IUser }                                                                 from '@modules/admin/user/profile/interfaces/user.interface';
import { BehaviorSubject }                                                       from 'rxjs';
import { ActivatedRoute }                                                        from '@angular/router';
import { DateTime }                                                              from 'luxon';
import { MatProgressSpinner }                                                    from '@angular/material/progress-spinner';
import { Notyf }                                                                 from 'notyf';
import { MemberService }                                                         from '@modules/admin/user/member.service';
import { fuseAnimations }                                                        from '../../../../../../../@fuse/animations';
import { CdkTextareaAutosize }                                                   from '@angular/cdk/text-field';

@Component({
    selector   : 'app-personal-information',
    standalone : true,
    imports    : [
        PageHeaderComponent,
        TranslocoDirective,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInput,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        NgIf,
        TranslocoPipe,
        MatButton,
        MatOption,
        MatSelect,
        AsyncPipe,
        MatProgressSpinner,
        CdkTextareaAutosize
    ],
    animations : fuseAnimations,
    templateUrl: './personal-information.component.html'
})
export class PersonalInformationComponent {
    public form: UntypedFormGroup;
    public avatarForm: UntypedFormGroup;

    public imageSrc = null;

    private _notyf = new Notyf({
        position   : {x: 'right', y: 'top'},
        dismissible: false
    });

    constructor(
        private readonly _fb: UntypedFormBuilder,
        private readonly _route: ActivatedRoute,
        private readonly _ts: TranslocoService,
        private readonly _userService: MemberService
    ) {
        const user = this._route.snapshot.data.user;
        this._user$.next(user);
        this.imageSrc = user.avatar?.fileUrl;

        this.form = this._buildForm(user);
        this.avatarForm = this._buildPictureForm();
    }

    private _user$: BehaviorSubject<IUser> = new BehaviorSubject(undefined);

    get user$() {
        return this._user$.asObservable();
    }

    public onFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.item(0);

        if (!file) return;

        this.avatarForm.patchValue({avatar: file});
        this.imageSrc = URL.createObjectURL(file);
    }

    public submit() {
        if (this.form.invalid) {
            this._notyf.error({
                message: this._ts.translate('errors.form.invalid')
            });
            return;
        }

        this.form.disable();

        const data = this.form.getRawValue();

        data.birthdate = data.birthdate.toFormat('yyyy-MM-dd');

        this._userService.update(data).subscribe({
            next    : (user: IUser) => {
                this.form.markAsPristine();
                this._notyf.success({
                    message: this._ts.translate('user.settings.personal-information.updated')
                });
            },
            error   : (error: any) => {
                this._notyf.error({
                    message: error.message
                });
            },
            complete: () => this.form.enable()
        });
    }

    public submitAvatar() {
        if (this.avatarForm.invalid) return;

        this.avatarForm.disable();

        const formData = new FormData();
        const form = this.avatarForm.getRawValue();

        formData.append('avatar', form.avatar);

        this._userService.updateAvatar(formData).subscribe({
            next : (user: IUser) => {
                location.reload();
            },
            error: (error: any) => {
                this.avatarForm.enable();
                this._notyf.error({message: 'Ha ocurrido un error al subir el avatar'});
            }
        });
    }

    private _buildForm(user: IUser) {
        const birthdate = user.birthdate && DateTime.fromFormat(user.birthdate, 'yyyy-MM-dd');

        return this._fb.group({
            firstname: [ user.firstname, Validators.required ],
            lastname : [ user.lastname, Validators.required ],
            email    : [ {value: user.email, disabled: true}, Validators.required ],
            birthdate: [ birthdate, Validators.required ],
            gender   : [ user.gender, Validators.required ],
            city     : [ user.city, Validators.required ],
            country  : [ {value: user.country || 'CL', disabled: true}, Validators.required ],
            bio      : [ user.bio ]
        });
    }

    private _buildPictureForm() {
        return this._fb.group({
            avatar: [ undefined, Validators.required ],
        });
    }
}

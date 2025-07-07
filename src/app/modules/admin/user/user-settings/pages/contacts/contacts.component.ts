import { ChangeDetectionStrategy, ChangeDetectorRef, Component }                                   from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule }                                                                      from '@angular/material/form-field';
import { MatIcon }                                                                                 from '@angular/material/icon';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { PageHeaderComponent }        from '@layout/components/page-header/page-header.component';
import { trackByFn }                  from '@libs/ui/utils/utils';
import { MemberService }              from '@modules/admin/user/member.service';
import { MatInput }                   from '@angular/material/input';
import { MatButton, MatIconButton }   from '@angular/material/button';
import { MatTooltip }                 from '@angular/material/tooltip';
import { Country }                    from '@modules/admin/apps/contacts/contacts.types';
import { ContactsService }            from '@modules/admin/apps/contacts/contacts.service';
import { SubComponent }               from '@layout/components/sub-component/sub-component';
import { takeUntil }                  from 'rxjs';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { IUser }                      from '@modules/admin/user/profile/interfaces/user.interface';
import { takeUntilDestroyed }         from '@angular/core/rxjs-interop';
import { MatProgressSpinner }         from '@angular/material/progress-spinner';
import { AuthService }                from '@core/auth/auth.service';
import { Contact }                    from '@modules/admin/apps/contacts/models/contact.types';
import { ContactTypeEnum }            from '@modules/admin/apps/contacts/enums/contact-type.enum';
import { Notyf }                      from 'notyf';

@Component({
    selector       : 'app-contacts',
    standalone     : true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports        : [
        TranslocoDirective,
        PageHeaderComponent,
        MatIcon,
        MatFormFieldModule,
        MatInput,
        ReactiveFormsModule,
        MatIconButton,
        MatTooltip,
        MatButton,
        MatSelectModule,
        MatOption,
        MatProgressSpinner,
        TranslocoPipe
    ],
    templateUrl    : './contacts.component.html'
})
export class ContactsComponent extends SubComponent {
    public form: UntypedFormGroup;
    public countries: Country[];
    public user: IUser;

    private _notyf = new Notyf({position: {x: 'right', y: 'top'}});

    protected readonly trackByFn = trackByFn;

    constructor(
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _fb: UntypedFormBuilder,
        private readonly _ts: TranslocoService,
        private readonly _authService: AuthService,
        private readonly _userService: MemberService,
        private readonly _contactsService: ContactsService,
    ) {
        super();

        this.form = this._fb.group({
            emails : this._fb.array([]),
            numbers: this._fb.array([]),
            socials: this._fb.array([])
        });

        this._userService.user$
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: (user: IUser) => {
                    this.user = user;

                    const currentCompanyId = this._authService.activeCompany().id;
                    const contacts = user.contacts.filter((contact) => contact.companyId === currentCompanyId);

                    const emails = contacts.filter((contact) => contact.type === ContactTypeEnum.EMAIL);
                    const numbers = contacts.filter((contact) => contact.type === ContactTypeEnum.PHONE);
                    const socials = contacts.filter((contact) => contact.type === ContactTypeEnum.SOCIAL);

                    if (emails.length === 0 && this.form.get('emails')['controls'].length === 0)
                        this.addEmailField({value: user.email, label: 'Work'}, true);

                    emails.forEach((contact) => this.addEmailField(contact));
                    numbers.forEach((contact) => {
                        const {country, phoneNumber} = JSON.parse(contact.value);

                        this.addPhoneNumberField({id: contact.id, label: contact.label, country, phoneNumber});
                    });
                    socials.forEach((contact) => this.addSocialField(contact));
                }
            });

        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._changeDetectorRef.markForCheck();
    }

    public submit() {
        const currentCompanyId = this._authService.activeCompany().id;

        this.form.disable();

        const form = this.form.getRawValue();
        const contactToPost: Contact[] = [];

        // Concat emails
        form.emails.map((email: { id: string, value: string, label: string }) => {
            contactToPost.push({
                id       : email.id,
                value    : email.value,
                label    : email.label,
                type     : ContactTypeEnum.EMAIL,
                companyId: currentCompanyId
            });
        });

        // Concat phoneNumbers
        form.numbers.map((number: { id: string, country: string, phoneNumber: string, label: string }) => {
            contactToPost.push({
                id       : number.id,
                value    : JSON.stringify({country: number.country, phoneNumber: number.phoneNumber}),
                label    : number.label,
                type     : ContactTypeEnum.PHONE,
                companyId: currentCompanyId
            });
        });

        // Concat socials
        form.socials.map((social: { id: string, value: string, label: string }) => {
            contactToPost.push({
                id       : social.id,
                value    : social.value,
                label    : social.label,
                type     : ContactTypeEnum.SOCIAL,
                companyId: currentCompanyId
            });
        });

        this._userService.updateContacts(contactToPost.map(contact => {
            if (!contact.id) delete contact.id;
            return contact;
        }))
            .subscribe({
                next : (user: IUser) => {
                    console.log(user);
                    this._notyf.success('Contacts updated successfully');
                    this.form.markAsPristine();
                    this.form.enable();
                },
                error: (err: any) => {
                    this._notyf.error('Error updating contacts: ' + err.message);
                    this.form.enable();
                }
            });
    }

    public addEmailField(data: Contact = undefined, disabled: boolean = false): void {
        // Create an empty email form group
        const emailFormGroup = this._fb.group({
            id: [ data?.id ],
            value: [ {value: data?.value, disabled}, Validators.required ],
            label: [ data?.label, Validators.required ],
        });


        // Add the email form group to the emails form array
        (this.form.get('emails') as UntypedFormArray).push(emailFormGroup);

        // Mark as pristine to avoid red borders bcs of required field
        emailFormGroup.markAsPristine();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    public removeEmailField(index: number): void {
        // Get form array for emails
        const emailsFormArray = this.form.get('emails') as UntypedFormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();

    }

    public addPhoneNumberField(phone?: { id: string, label: string, country: string, phoneNumber: string }): void {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._fb.group({
            id         : [ phone?.id ],
            country    : [ phone?.country || 'cl', Validators.required ],
            phoneNumber: [ phone?.phoneNumber, Validators.required ],
            label      : [ phone?.label, Validators.required ],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.form.get('numbers') as UntypedFormArray).push(phoneNumberFormGroup);

        phoneNumberFormGroup.markAsPristine();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    public removePhoneNumberField(index: number): void {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.form.get('numbers') as UntypedFormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    public addSocialField(contact?: Contact): void {
        // Create an empty email form group
        const socialFormGroup = this._fb.group({
            id   : [ contact?.id ],
            value: [ contact?.value, Validators.required ],
            label: [ contact?.label, Validators.required ],
        });

        // Add the email form group to the emails form array
        (this.form.get('socials') as UntypedFormArray).push(socialFormGroup);

        socialFormGroup.markAsPristine();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    public removeSocialField(index: number): void {
        // Get form array for social accounts
        const socialsFormArray = this.form.get('socials') as UntypedFormArray;

        // Remove the phone number field
        socialsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    public getCountryByIso(iso: string): Country {
        return this.countries.find((country) => country.iso === iso);
    }
}

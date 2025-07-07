import { DatePipe, NgFor, NgIf }                                                                       from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule }                                                                             from '@angular/material/button';
import { MatIconModule }                                                                               from '@angular/material/icon';
import { MatDrawerToggleResult }                                                                       from '@angular/material/sidenav';
import { MatTooltip }                                                                                  from '@angular/material/tooltip';
import { RouterLink }                                                                                  from '@angular/router';

import { Subject, takeUntil }    from 'rxjs';
import { Country, UserContact }  from '@modules/admin/apps/contacts/contacts.types';
import { ContactsListComponent } from '@modules/admin/apps/contacts/pages/list/list.component';
import { ContactsService }       from '@modules/admin/apps/contacts/contacts.service';

@Component({
    selector       : 'contacts-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [ NgIf, MatButtonModule, RouterLink, MatIconModule, NgFor, DatePipe, MatTooltip ],
})
export class ContactsDetailsComponent implements OnInit, OnDestroy {
    contact: UserContact;
    countries: Country[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ContactsListComponent,
        private _contactsService: ContactsService
    ) {
    }

    ngOnInit(): void {
        // Open the drawer
        this._contactsListComponent.matDrawer.open();

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: UserContact) => {
                // Open the drawer in case it is closed
                this._contactsListComponent.matDrawer.open();

                // Get the contact
                this.contact = contact;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the country telephone codes
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._contactsListComponent.matDrawer.close();
    }

    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = [ 'image/jpeg', 'image/png' ];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        // Upload the avatar
        this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
    }

    getCountryByIso(iso: string): Country {
        return this.countries.find(country => country.iso === iso);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}

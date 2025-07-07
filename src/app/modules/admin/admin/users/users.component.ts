import { AsyncPipe, TitleCasePipe }               from '@angular/common';
import { Component, OnInit }                      from '@angular/core';
import { takeUntilDestroyed }                     from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule }       from '@angular/forms';
import { MatIconButton }                          from '@angular/material/button';
import { MatDialog }                              from '@angular/material/dialog';
import { MatFormFieldModule, MatHint }            from '@angular/material/form-field';
import { MatIcon }                                from '@angular/material/icon';
import { MatInput }                               from '@angular/material/input';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatTooltip }                             from '@angular/material/tooltip';

import { TranslocoDirective }                                             from '@ngneat/transloco';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { rolesList }               from '@core/constants';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageHeaderComponent }     from '@layout/components/page-header/page-header.component';
import { trackByFn }               from '@libs/ui/utils/utils';
import { UsersService }            from '@modules/admin/admin/users/users.service';
import { CompanyUser }             from '@modules/admin/admin/users/model/company-user.model';
import { MemberNewComponent }      from '@modules/admin/admin/users/dialogs/member-new/member-new.component';
import { GetInvitationsComponent } from './dialogs/get-invitations/get-invitations.component';
import { Page }                    from '@core/interfaces/page';

@Component({
    selector   : 'app-users',
    standalone : true,
    imports: [
        PageHeaderComponent,
        TranslocoDirective,
        MatFormFieldModule,
        MatIcon,
        MatInput,
        MatIconButton,
        MatSelect,
        MatSelectTrigger,
        MatOption,
        TitleCasePipe,
        MatTooltip,
        ReactiveFormsModule,
        AsyncPipe,
        MatHint
    ],
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    roles: any[];
    public searchControl = new FormControl('');
    public members$ = new BehaviorSubject<Page<CompanyUser>>(null);

    protected readonly trackByFn = trackByFn;

    constructor(
        private readonly _fuseConfirmationService: FuseConfirmationService,
        private readonly _matDialog: MatDialog,
        private readonly _usersService: UsersService
    ) {
        this._subscribeToSearchControl();
        this._usersService.membersPage$.pipe(takeUntilDestroyed()).subscribe((members) => {
            this.members$.next(members);
        });
    }

    ngOnInit(): void {
        this.roles = rolesList;
    }

    deleteMember(id): void {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Remove member',
            message: 'Are you sure you want to remove this member from the company? This action cannot be undone.',
            actions: {
                confirm: {label: 'Remove'},
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log('Delete member', id);
                // this._scrumboardService.deleteList(id).subscribe();
            }
        });
    }

    openNewMemberDialog() {
        this._matDialog.open(MemberNewComponent, {
            panelClass: 'dialog-mobile-fullscreen',
        });
    }

    openInvitationsDialog() {
        this._matDialog.open(GetInvitationsComponent, {
            panelClass: 'dialog-mobile-fullscreen',
        });
    }

    private _subscribeToSearchControl() {
        this.searchControl.valueChanges.pipe(
            takeUntilDestroyed(),
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap((value) => this._usersService.getMembers({query: {name: value}}))
        ).subscribe();
    }
}

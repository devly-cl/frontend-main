import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButton }                                                     from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger }                          from '@angular/material/menu';
import { AsyncPipe, NgIf, NgTemplateOutlet }                             from '@angular/common';

import { firstValueFrom } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@core/user/user.service';
import { MatIcon }     from '@angular/material/icon';

@Component({
    selector       : 'company-selector',
    templateUrl    : './company-selector.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [
        MatMenu,
        MatMenuItem,
        NgTemplateOutlet,
        MatMenuTrigger,
        AsyncPipe,
        NgIf,
        MatIcon,
        MatButton
    ],
})
export class CompanySelectorComponent {
    public authService: AuthService = inject(AuthService);
    public userService: UserService = inject(UserService);

    constructor() {}

    async setActiveCompany(id: string) {
        const validation = await firstValueFrom(this.authService.isUserInCompany(id));

        if (!validation) location.reload();

        firstValueFrom(this.authService.setActiveCompany(id)).then(() => {
            // TODO: Add a toast notification here
            location.reload();
        });
    }
}

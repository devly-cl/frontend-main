import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component }              from '@angular/core';
import { MatIcon }                from '@angular/material/icon';
import { RouterLink }             from '@angular/router';

import { TranslocoDirective } from '@ngneat/transloco';

import { Shortcut } from '@modules/admin/home/components/shortcuts/shortcut.type';

@Component({
    selector   : 'home-shortcuts',
    standalone : true,
    imports: [ TranslocoDirective, MatIcon, NgIf, RouterLink, NgTemplateOutlet ],
    templateUrl: './shortcuts.component.html'
})
export class ShortcutsComponent {
    shortcuts: Shortcut[];

    constructor() {
        this.shortcuts = [
            {id: 'files-library', svgIcon: 'heroicons_solid:document', link: '/apps/files-library', useRouter: true},
            {id: 'scrumboards', svgIcon: 'heroicons_solid:rectangle-stack', link: '/apps/scrumboards', useRouter: true},
            {id: 'benefits', svgIcon: 'heroicons_solid:gift', link: '/apps/benefits', useRouter: true},
            {id: 'contacts', svgIcon: 'heroicons_solid:user-group', link: '/apps/contacts', useRouter: true}
        ];
    }
}

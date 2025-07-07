import { Component }                                           from '@angular/core';
import { RouterOutlet }                                        from '@angular/router';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { DrawerContentComponent }                              from '@shared/components/drawer-listing/components/drawer-content.component';
import { DrawerListingComponent }                              from '@shared/components/drawer-listing/drawer-listing.component';
import { PanelType }                                           from '@shared/components/drawer-listing/panel.type';

@Component({
    selector   : 'app-benefits',
    standalone : true,
    imports: [
        RouterOutlet,
        DrawerListingComponent,
        TranslocoDirective,
        DrawerContentComponent,
        TranslocoPipe
    ],
    templateUrl: './benefits.component.html'
})
export class BenefitsComponent {
    panels: PanelType[];

    constructor(private readonly translateService: TranslocoService) {
        this.panels = [
            {
                icon       : 'heroicons_outline:gift',
                title      : this.translateService.translate('admin.benefits.title'),
                description: this.translateService.translate('admin.benefits.subtitle'),
                children   : [
                    {
                        id         : 'list',
                        icon       : 'heroicons_outline:list-bullet',
                        title      : this.translateService.translate('admin.benefits.list.title'),
                        description: this.translateService.translate('admin.benefits.list.subtitle'),
                        link       : '/admin/benefits/'
                    },
                    {
                        id         : 'create',
                        icon       : 'heroicons_outline:plus-circle',
                        title      : this.translateService.translate('admin.benefits.create.title'),
                        description: this.translateService.translate('admin.benefits.create.subtitle'),
                        link       : '/admin/benefits/create'
                    },
                ]
            },
            {
                icon       : 'heroicons_outline:cube',
                title      : this.translateService.translate('admin.benefits.category.title'),
                description: this.translateService.translate('admin.benefits.category.subtitle'),
                children   : [
                    {
                        id         : 'list-categories',
                        icon       : 'heroicons_outline:list-bullet',
                        title      : this.translateService.translate('admin.benefits.category.list.title'),
                        description: this.translateService.translate('admin.benefits.category.list.subtitle'),
                        link       : '/admin/benefits/category'
                    },
                    {
                        id         : 'create-category',
                        icon       : 'heroicons_outline:plus-circle',
                        title      : this.translateService.translate('admin.benefits.category.create.title'),
                        description: this.translateService.translate('admin.benefits.category.create.subtitle'),
                        link       : '/admin/benefits/category/create'
                    },
                ]
            },
            {
                icon       : 'heroicons_outline:building-office',
                title      : this.translateService.translate('admin.benefits.company.title'),
                description: this.translateService.translate('admin.benefits.company.subtitle'),
                children   : [
                    {
                        id         : 'list-companies',
                        icon       : 'heroicons_outline:list-bullet',
                        title      : this.translateService.translate('admin.benefits.company.list.title'),
                        description: this.translateService.translate('admin.benefits.company.list.subtitle'),
                        link       : '/admin/benefits/company'
                    },
                    {
                        id         : 'create-company',
                        icon       : 'heroicons_outline:plus-circle',
                        title      : this.translateService.translate('admin.benefits.company.create.title'),
                        description: this.translateService.translate('admin.benefits.company.create.subtitle'),
                        link       : '/admin/benefits/company/create'
                    }
                ]
            }
        ];
    }
}

import { CdkTextareaAutosize }                                                                     from '@angular/cdk/text-field';
import { NgIf }                                                                                    from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit }                                      from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton }                                                          from '@angular/material/button';
import { MatCheckbox }                                                                             from '@angular/material/checkbox';
import { MatOptionModule }                                                                         from '@angular/material/core';
import { MatDatepickerModule }                                                                     from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef }                                                           from '@angular/material/dialog';
import { MatDivider }                                                                              from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle }        from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel }                                                            from '@angular/material/form-field';
import { MatIcon }                                                                                 from '@angular/material/icon';
import { MatInputModule }                                                                          from '@angular/material/input';
import { MatProgressSpinner }                                                                      from '@angular/material/progress-spinner';
import { MatSelectModule }                                                                         from '@angular/material/select';
import { MatStepperModule }                                                                        from '@angular/material/stepper';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { DateTime }                                            from 'luxon';
import { Notyf }                                               from 'notyf';
import { takeUntil }                                           from 'rxjs';

import { trackByFn }                     from '@libs/ui/utils/utils';
import { DEFAULT_DATETIME_TIME_OPTIONS } from '@core/constants';
import { IEvent }                        from '@modules/admin/home/interface/event.interface';
import { OpenStreetMapComponent }        from '../../components/open-street-map/open-street-map.component';
import { EventsService }                 from '../../events.service';

const EventStatusEnum = {
    DRAFT      : 'draft',
    PUBLISHED  : 'published',
    CANCELLED  : 'cancelled',
    POSTPONED  : 'postponed',
    RESCHEDULED: 'rescheduled',
    ENDED      : 'ended',
};

const EventTypeEnum = {
    CONFERENCE : 'conference',
    MEETUP     : 'meetup',
    WORKSHOP   : 'workshop',
    SEMINAR    : 'seminar',
    WEBINAR    : 'webinar',
    HACKATHON  : 'hackathon',
    CONCERT    : 'concert',
    FESTIVAL   : 'festival',
    EXHIBITION : 'exhibition',
    FAIR       : 'fair',
    SHOW       : 'show',
    PERFORMANCE: 'performance',
    COMPETITION: 'competition',
    GAME       : 'game',
    SPORTS     : 'sports',
};

const EventPlatformEnum = {
    GMEET  : 'gmeet',
    ZOOM   : 'zoom',
    TEAMS  : 'teams',
    MAPS   : 'maps',
    WEBSITE: 'website',
    OTHER  : 'other',
};

@Component({
    selector       : 'app-new',
    standalone     : true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CdkTextareaAutosize,
        MatButtonModule,
        MatCheckbox,
        MatDatepickerModule,
        MatDivider,
        MatFormFieldModule,
        MatIcon,
        MatIconButton,
        MatInputModule,
        MatLabel,
        MatOptionModule,
        MatProgressSpinner,
        MatSelectModule,
        MatStepperModule,
        NgIf,
        OpenStreetMapComponent,
        ReactiveFormsModule,
        TranslocoDirective,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        TranslocoPipe,
    ],
    templateUrl    : './new-or-edit.component.html',
})
export class NewOrEditComponent implements OnInit {
    eventForm: UntypedFormGroup;
    notyf = new Notyf();

    eventStatusOptions = Object.values(EventStatusEnum);
    eventTypeOptions = Object.values(EventTypeEnum);
    eventPlatformOptions = Object.values(EventPlatformEnum);

    protected readonly trackByFn = trackByFn;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { event: IEvent },
        public readonly _matDialogRef: MatDialogRef<NewOrEditComponent>,
        private readonly _translocoService: TranslocoService,
        private readonly _formBuilder: UntypedFormBuilder,
        private readonly _eventsService: EventsService
    ) {}

    get urlArray(): UntypedFormArray {
        return this.eventForm.get('step2.url') as UntypedFormArray;
    }

    ngOnInit(): void {
        if (this.data?.event) {
            this.eventForm = this._createEventForm(this.data);
        } else {
            this.eventForm = this._createEventForm();
        }
    }

    addUrl(): void {
        const urlGroup = this._formBuilder.group({
            platform : [ undefined, Validators.required ],
            label    : [ undefined, Validators.required ],
            url      : [ undefined ],
            latitude : [ undefined ],
            longitude: [ undefined ],
        });
        this.urlArray.push(urlGroup);
    }

    getAvailablePlatforms(index: number): string[] {
        const selectPlatforms = this.urlArray.controls.map(control => control.get('platform').value);
        return this.eventPlatformOptions.filter(platform => !selectPlatforms.includes(platform) || selectPlatforms.indexOf(platform) === index);
    }

    onPlatformSelected(index: number, event: { value: string }): void {
        const urlGroup = this.urlArray.at(index) as UntypedFormGroup;
        const platformValue = event.value;

        urlGroup.controls['url'].clearValidators();
        urlGroup.controls['url'].updateValueAndValidity();
        urlGroup.controls['latitude'].clearValidators();
        urlGroup.controls['latitude'].updateValueAndValidity();
        urlGroup.controls['longitude'].clearValidators();
        urlGroup.controls['longitude'].updateValueAndValidity();

        switch (platformValue) {
            case EventPlatformEnum.MAPS:
                urlGroup.controls['latitude'].setValidators([ Validators.required ]);
                urlGroup.controls['latitude'].updateValueAndValidity();
                urlGroup.controls['longitude'].setValidators([ Validators.required ]);
                urlGroup.controls['longitude'].updateValueAndValidity();
                break;
            default:
                urlGroup.controls['url'].setValidators([ Validators.required ]);
                urlGroup.controls['url'].updateValueAndValidity();
                break;
        }
        urlGroup.patchValue({
            platform: event.value,
        });
    }

    removeUrl(index: number): void {
        this.urlArray.removeAt(index);
    }

    onLocationSelected(index: number, event: { latitude: number; longitude: number }): void {
        const urlGroup = this.urlArray.at(index) as UntypedFormGroup;
        urlGroup.patchValue({
            latitude : event.latitude,
            longitude: event.longitude,
        });
        console.log('urlGroup', urlGroup.value);
    }

    discard(): void {
        this._matDialogRef.close();
    }

    save(): void {
        Object.keys(this.eventForm.controls).forEach((key) => {
            if (this.eventForm.get(key).errors)
                console.log(this.eventForm.get(key).errors);
        });

        if (this.eventForm.valid) {
            this.eventForm.disable();

            const flattenedData = this.flattenFormData(this.eventForm.getRawValue());

            if (this.data?.event) {
                const eventId = this.data.event.id;
                try {
                    this._eventsService
                        .updateEvent(eventId, flattenedData)
                        .pipe(takeUntil(this._matDialogRef.afterClosed()))
                        .subscribe({
                            next : (result) => {
                                this._matDialogRef.close();
                            },
                            error: (error) => {
                                this.notyf.error({
                                    message : this._translocoService.translate('errors.service.message'),
                                    position: {x: 'right', y: 'top'},
                                });
                                this.eventForm.enable();
                            },
                        });
                } catch (error) {
                    this.notyf.error({
                        message : this._translocoService.translate('errors.runtime.message'),
                        position: {x: 'right', y: 'top'},
                    });
                    this.eventForm.enable();
                }
            } else {
                try {
                    this._eventsService
                        .createEvent(flattenedData)
                        .pipe(takeUntil(this._matDialogRef.afterClosed()))
                        .subscribe({
                            next : (result) => {
                                this._matDialogRef.close(result);
                            },
                            error: (error) => {
                                this.notyf.error({
                                    message : this._translocoService.translate('errors.service.message'),
                                    position: {x: 'right', y: 'top'},
                                });
                                this.eventForm.enable();
                            },
                        });
                } catch (error) {
                    this.notyf.error({
                        message : this._translocoService.translate('errors.runtime.message'),
                        position: {x: 'right', y: 'top'},
                    });
                    this.eventForm.enable();
                }
            }
        }
    }

    flattenFormData(formData: any): any {
        if (typeof formData.step1.startDate === 'string') formData.step1.startDate = DateTime.fromISO(formData.step1.startDate);

        const {startDate, startDateTime, endDate, endDateTime, isAllDay}: {
            startDate: DateTime,
            startDateTime: string,
            endDate: DateTime,
            endDateTime: string,
            isAllDay: boolean,
        } = formData.step1;

        // combine start date with time
        const [ hour, minute ] = startDateTime.split(':');
        const startDateTimeCombined = startDate.set({hour: +hour, minute: +minute});

        if (isAllDay)
            return {
                ...formData.step1,
                ...formData.step2,
                ...formData.step3,
                startDate: startDateTimeCombined,
                endDate  : undefined
            };
        else {
            const [ endHour, endMinute ] = endDateTime?.split(':');
            const endDateTimeCombined = startDate.set({hour: +endHour, minute: +endMinute});

            return {
                ...formData.step1,
                ...formData.step2,
                ...formData.step3,
                startDate: startDateTimeCombined,
                endDate  : endDateTimeCombined
            };
        }
    }

    remove() {
        console.log('remove');
    }

    private _createEventForm(data?: any) {
        const startDate = data?.event ? DateTime.fromISO(data.event.startDate) : undefined;
        const endDate = data?.event && data.event.endDate ? DateTime.fromISO(data.event.endDate) : undefined;

        return this._formBuilder.group({
            step1: this._formBuilder.group({
                title        : [ data?.event?.title, [ Validators.required, Validators.minLength(3), Validators.maxLength(100) ] ],
                description  : [ data?.event?.description, [ Validators.required, Validators.minLength(3) ] ],
                isAllDay     : [ data?.event?.isAllDay ?? true, [ Validators.required ] ],
                startDate    : [ startDate ? startDate.toISODate() : undefined, [ Validators.required ] ],
                startDateTime: [ startDate ? startDate.toISOTime(DEFAULT_DATETIME_TIME_OPTIONS) : undefined, [ Validators.required ] ],
                endDateTime  : [ endDate ? endDate.toISOTime(DEFAULT_DATETIME_TIME_OPTIONS) : undefined ],
            }),
            step2: this._formBuilder.group({
                location: [ data?.event?.location, [ Validators.required, Validators.minLength(3), Validators.maxLength(255) ] ],
                url     : this._formBuilder.array(
                    data?.event?.url.map((url) => this._formBuilder.group({
                        platform : [ url.platform, [ Validators.required ] ],
                        label    : [ url.label, [ Validators.required ] ],
                        url      : [ url.url ],
                        latitude : [ {value: url.latitude, disabled: true} ],
                        longitude: [ {value: url.longitude, disabled: true} ],
                    })) || []
                ),
                image   : [ data?.event?.image ],
                capacity: [ data?.event?.capacity ],
            }),
            step3: this._formBuilder.group({
                organizer: this._formBuilder.group({
                    name : [ data?.event?.organizer?.name, [ Validators.required, Validators.minLength(3), Validators.maxLength(255) ] ],
                    email: [ data?.event?.organizer?.email, [ Validators.required, Validators.email ] ],
                    phone: this._formBuilder.group({
                        countryCode: [ data?.event?.organizer?.phone?.countryCode || '+56', [ Validators.required ] ],
                        number     : [ data?.event?.organizer?.phone?.number, [ Validators.required, Validators.minLength(7), Validators.maxLength(15) ] ],
                    }),
                }),
                type     : [ data?.event?.type, [ Validators.required ] ],
                status   : [ data?.event?.status, [ Validators.required ] ],
            }),
        });
    }
}

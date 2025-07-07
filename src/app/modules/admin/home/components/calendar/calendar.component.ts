import { AfterViewInit, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { DatePipe }                                                       from '@angular/common';
import { MatDialog }                                                      from '@angular/material/dialog';

import { TranslocoDirective }                                       from '@ngneat/transloco';
import { CalendarCommonModule, CalendarEvent, CalendarMonthModule } from 'angular-calendar';
import VanillaCalendar                                              from 'vanilla-calendar-pro';
import { FormatDateString, IOptions, IVanillaCalendar }             from 'vanilla-calendar-pro/types';
import { take }                                                     from 'rxjs';

import { EventModalComponent } from '@modules/admin/home/entry-components/event-modal/event-modal.component';
import { EventCardComponent }  from '@modules/admin/home/components/event-card/event-card.component';
import { CalendarService }     from './calendar.service';
import { DateTime }            from 'luxon';

@Component({
    selector     : 'home-calendar',
    standalone   : true,
    imports: [ CalendarMonthModule, CalendarCommonModule, TranslocoDirective, DatePipe, EventCardComponent ],
    templateUrl  : './calendar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : [ './calendar.component.scss' ],
})
export class CalendarComponent implements AfterViewInit {
    selectedDate: Date;
    today: Date = new Date();
    events: CalendarEvent[];
    filteredEvents: CalendarEvent[] = [];

    constructor(
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _calendarService: CalendarService
    ) {
        this._calendarService
            .getEvents()
            .pipe(take(1))
            .subscribe((events) => {
                this.events = events.map((event) => {
                    return {
                        ...event,
                        id    : event.id,
                        start : new Date(event.start.toISODate()),
                        end   : event.end ? new Date(event.end.toISO()) : null,
                        allDay: event.isAllDay,
                        title : event.title,
                        color : {
                            primary  : '#FFA500',
                            secondary: '#FFD700',
                        },
                        meta  : {
                            ...event
                        }
                    } as CalendarEvent;
                });

                const calendar = new VanillaCalendar('#activity-calendar', {
                    CSSClasses: {
                        calendar: 'vanilla-calendar',
                        day     : 'vanilla-calendar__day',
                    },

                    events : this.events,
                    actions: {
                        clickDay: (e: MouseEvent, self: VanillaCalendar) => this.clickDay(self.selectedDates ? self.selectedDates[0] : undefined),
                        getDays : (day, date, HTMLElement, HTMLButtonElement, self) => this.getDays(day, date, HTMLElement, HTMLButtonElement, self),
                    },
                    date   : {
                        today: new Date(),
                    },
                } as IOptions);
                calendar.init();

                this._changeDetectorRef.detectChanges();
            });
        this.selectedDate = this.today;
    }

    ngAfterViewInit(): void {

    }

    openEventDetail(event: CalendarEvent): void {
        this._matDialog.open(EventModalComponent, {
            autoFocus        : false,
            panelClass       : [ 'md:max-w-160', 'dialog-mobile-fullscreen' ],
            closeOnNavigation: true,
            data             : {event},
        });
    }

    clickDay(selectedDate: string): void {
        // const selectedDate = DateTime.fromFormatExplain()
        this.filteredEvents = [];
        if (!selectedDate)
            this.selectedDate = this.today;
        else {
            const [ year, month, day ] = selectedDate.split('-').map(Number);
            this.selectedDate = DateTime.fromObject({year, month, day}).toJSDate();
        }

        const selectedDateString = DateTime.fromJSDate(this.selectedDate).toISODate();

        this.filteredEvents = this.events.filter((event) => {
            const eventDate = event.start.toISOString().split('T')[0];
            return eventDate === selectedDateString;
        });
    }

    getDays(day: number, date: FormatDateString, HTMLElement: HTMLElement, HTMLButtonElement: HTMLButtonElement, self: IVanillaCalendar): void {
        HTMLButtonElement.style.flexDirection = 'column';
        HTMLButtonElement.innerHTML = `<span>${ day }</span>`;

        const eventsForDay = this.events.filter((event) => {
            const eventDate = event.start.toISOString().split('T')[0]; // Obtener la fecha en formato YYYY-MM-DD
            return eventDate === date;
        });

        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'gap-x-1');

        const addedColors = new Set<string>();

        eventsForDay.forEach((e) => {
            if (!addedColors.has(e.color.primary)) {
                addedColors.add(e.color.primary);

                const event = document.createElement('div');
                event.classList.add('event');
                event.style.backgroundColor = e.color.primary;
                event.style.width = '5px';
                event.style.height = '5px';
                event.style.borderRadius = '50%';
                event.style.marginTop = '4px';
                dotsContainer.appendChild(event);
            }
        });

        HTMLButtonElement.appendChild(dotsContainer);
    }
}

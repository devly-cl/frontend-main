import { ChangeDetectionStrategy, Component, input }                                            from '@angular/core';
import { MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker, MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { MatFormField, MatSuffix }                                                              from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule }                                          from '@angular/forms';
import { DateTime }                                                                             from 'luxon';

@Component({
    selector       : 'date-range-filter-field',
    imports        : [
        MatDateRangeInput,
        MatDateRangePicker,
        MatDatepickerToggle,
        MatEndDate,
        MatFormField,
        MatStartDate,
        MatSuffix,
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template       : `
        <mat-form-field class="fuse-mat-dense w-full" subscriptSizing="dynamic">
            <mat-date-range-input [formGroup]="filterGroup()" [rangePicker]="picker">
                <input formControlName="from" matStartDate placeholder="Start date">
                <input formControlName="to" matEndDate placeholder="End date">
            </mat-date-range-input>
            <mat-datepicker-toggle [for]="picker" matIconSuffix></mat-datepicker-toggle>
            <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>
    `
})
export class DateRangeFilterFieldComponent {
    header = input.required<string>();
    filterGroup = input.required<FormGroup<{ from: FormControl<DateTime>, to: FormControl<DateTime> }>>();
}

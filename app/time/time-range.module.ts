import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }   from '@angular/forms';

// Imports for loading & configuring the in-memory web api
import { TimePickerComponent } from './time-picker.component';
import { DatePickerComponent } from './date-picker.component';
import { DateTimePickerComponent } from './datetime-picker.component';
import { RelativePickerComponent } from './relative-picker.component';
import { TimeRangeComponent } from './time-range.component';
import { DatepickerModule, AlertModule, ButtonsModule, TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
//import { SelectModule } from 'ng2-select';

@NgModule({
  imports:      [ CommonModule, FormsModule, DatepickerModule, AlertModule, ButtonsModule, TypeaheadModule ],
  declarations: [ TimePickerComponent, DatePickerComponent, DateTimePickerComponent, RelativePickerComponent, TimeRangeComponent],
  exports:      [ TimeRangeComponent ]
})
export class TimeRangeModule { }
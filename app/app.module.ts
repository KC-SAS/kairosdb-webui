import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppComponent }   from './app.component';
import { QueryComponent } from './query.component';
import { AppRoutingModule } from './app-routing.module';

// Imports for loading & configuring the in-memory web api
import { TimePickerComponent } from './time-picker.component';
import { DatePickerComponent } from './date-picker.component';
import { DatepickerModule, AlertModule, ButtonsModule, TypeaheadModule  } from 'ng2-bootstrap/ng2-bootstrap';
//import { SelectModule } from 'ng2-select';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, /*InMemoryWebApiModule.forRoot(InMemoryDataService),*/ AppRoutingModule, 
                  DatepickerModule, AlertModule, ButtonsModule, TypeaheadModule ],
  declarations: [ AppComponent, TimePickerComponent, DatePickerComponent, QueryComponent ],
  bootstrap:    [ AppComponent ]
  // providers:    [ HeroService ]
})
export class AppModule { }
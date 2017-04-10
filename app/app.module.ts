import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppComponent }   from './app.component';
import { QueryComponent } from './query.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { QueryService } from './query.service';
import { DescriptorService } from './descriptors.service';

import { MetricEditorComponent } from './metric-editor.component';
import { MetricListComponent } from './metric-list.component';
import { TagEditorComponent } from './tag-editor.component';
import { TagListComponent } from './tag-list.component';
import { PsListComponent } from './generic-ps-list.component';
import { PsEditorComponent } from './generic-ps-editor.component';
import { PsFieldComponent } from './generic-ps-field.component';
import { LineChartComponent } from './line-chart.component';
import { QueryStatusComponent } from './query-status.component';

import { AlertModule, ButtonsModule, TypeaheadModule, TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TimeRangeModule } from './time/time-range.module';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, /*InMemoryWebApiModule.forRoot(InMemoryDataService),*/ AppRoutingModule,
                  TimeRangeModule, AlertModule.forRoot(), ButtonsModule.forRoot(), TypeaheadModule.forRoot(), TooltipModule.forRoot(), SharedModule ],
  declarations: [
    AppComponent, QueryComponent, MetricEditorComponent, MetricListComponent,
    TagEditorComponent, TagListComponent, PsListComponent, PsEditorComponent, PsFieldComponent,
    LineChartComponent, QueryStatusComponent
  ],
  bootstrap:    [ AppComponent ],
  providers:    [ QueryService, DescriptorService ]
})
export class AppModule { }

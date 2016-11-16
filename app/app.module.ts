import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppComponent }   from './app.component';
import { QueryComponent } from './query.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { QueryService } from './query.service';

import { MetricComponent } from './metric.component';
import { TagEditorComponent } from './tag-editor.component';
import { TagListComponent } from './tag-list.component';
import { AggregatorListComponent } from './aggregator-list.component';
import { AggregatorEditorComponent } from './aggregator-editor.component';

import { AlertModule, ButtonsModule, TypeaheadModule, AccordionModule, TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TimeRangeModule } from './time/time-range.module';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, /*InMemoryWebApiModule.forRoot(InMemoryDataService),*/ AppRoutingModule, 
                  TimeRangeModule, AlertModule, ButtonsModule, TypeaheadModule, AccordionModule, TooltipModule, SharedModule ],
  declarations: [ AppComponent, QueryComponent, MetricComponent, TagEditorComponent, TagListComponent, AggregatorListComponent, AggregatorEditorComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ QueryService ]
})
export class AppModule { }
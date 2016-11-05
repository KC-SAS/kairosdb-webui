import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    selector: 'kairos-relativepicker',
    template: `
    <div class="input-group">
        <input type="text" style="width:50px;margin-right:-1px;" class="form-control" aria-label="..." [(ngModel)]="model.value" (keyup)="modelChange.emit(model)">
        <select style="width:200px" class="form-control" [(ngModel)]="model.unit" (change)="modelChange.emit(model)" >
            <option [value]="'years'">Years</option>
            <option [value]="'months'">Months</option>
			<option [value]="'weeks'">Weeks</option>
			<option [value]="'days'">Days</option>
      		<option [value]="'hours'">Hours</option>
			<option [value]="'minutes'">Minutes</option>
			<option [value]="'seconds'">Seconds</option>
    	</select>
		<input type="text" value="ago" style="width:50px;margin-left:-1px;" class="form-control" aria-label="..." disabled>
    </div>
  `,
    styles: [`
    .form-control[disabled] {
        cursor: default;
    }
  `],
})
export class RelativePickerComponent implements OnChanges{
    
    @Input()
    model;

    @Output()
    modelChange = new EventEmitter();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['model'] && (changes['model'].currentValue===undefined || changes['model'].currentValue===null)) {
            this.model={};
        }
    }


}



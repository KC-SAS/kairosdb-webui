import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'kairos-relativepicker',
    templateUrl: 'relative-picker.component.html',
    styleUrls: [ 'relative-picker.component.css' ],
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

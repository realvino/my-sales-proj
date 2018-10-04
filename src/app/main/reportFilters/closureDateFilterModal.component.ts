import { Component, OnInit, Input, Output, ViewChild, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from "moment";

const noop = () => {
};

export const PICK_LIST_MENU_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ClosureDateFilterComponent ),
  multi: true
};

@Component({
  selector: 'closureDateFilterModal',
  templateUrl: './closureDateFilterModal.component.html',
  providers: [PICK_LIST_MENU_VALUE_ACCESSOR]

})

export class ClosureDateFilterComponent  implements OnInit, ControlValueAccessor {

  @Input() options: any[];
  @Input() defaultLabel: string;
  @ViewChild('menu') menu: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  filterDate1:string;
  filterDate2:string;
  private model: any = '';
  from:number;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  closedateFilters:Array<any>;

  constructor(
  ) { }

  ngOnInit() {
    this.closedateFilters = [];
  }

  show($event, target) {
    this.menu.show($event, target);
  }

  toggle($event, target) {
    this.from = target;
    this.menu.toggle($event);
    if(this.options[0].selected == true){
      this.closedateFilters = [];
      this.filterDate2 = "";
      this.options[0].selected = false;
    }
  }
  close()
  {
     this.filterDate2 = "";
     this.closedateFilters = [];
     this.onChange.emit({originalEvent: this.from,value: 0, datepicker: ""});
  }

  selectedCloseDateFilter(dateId):void{
    this.closedateFilters  =[];
  }
  onSelectMethod1($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('DD-MM-YYYY')});
  }
  onSelectMethod2($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('DD-MM-YYYY')});
  }

  get value(): any {
    return this.model;
  };

  set value(v: any) {
    if (v !== this.model) {
      this.model = v;
      this.onChangeCallback(v);
    }
  }

  onBlur() {
    this.onTouchedCallback();
  }

  writeValue(value: any) {
    if (value !== this.model) {
      this.model = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  
}

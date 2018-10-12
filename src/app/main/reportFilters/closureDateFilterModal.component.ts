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
  filterDate3:string;
  filterDate4:string;
  filterDate5:string;
  private model: any = '';
  from:number;
  dfilterDto:Array<any>;
  dateFilters:Array<any>;
  createdDateFilterId:number;
  submittedDateFilterId:number;
  wonDateFilterId:number;
  lostDateFilterId:number;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(
  ) { }

  ngOnInit() {
    this.dateFilters = [];
    this.dfilterDto = [{id:'1', name:'This Week'},
                        {id:'2', name:'This Month'},
                        {id:'3', name:'This Year'},
                        {id:'4', name:'Last 3 Months'},
                        {id:'5', name:'Last 6 Months'},
                        {id:'6', name:'Last Year'},
                        {id:'7', name:'Custom'},
                        {id:'8', name:'Less Than Today'},
                        {id:'9', name:'Less Than Tomorrow'},
                        {id:'10', name:'Null'}
                      ];

      this.dfilterDto.forEach((p:{id: number, name: string})=>{
        this.dateFilters.push({
            id:   p.id,
            name: p.name,
            selected: false
        });
      });
  }

  show($event, target) {
    this.menu.show($event, target);
  }

  toggle($event, target) {
    this.from = target;
    this.menu.toggle($event);
  }
  close()
  {
     this.filterDate1 = '';
     this.filterDate3 = '';
     this.filterDate4 = '';
     this.filterDate5 = '';
     this.createdDateFilterId = 0;
     this.submittedDateFilterId= 0;
     this.wonDateFilterId = 0;
     this.lostDateFilterId = 0;
     this.dateFilters = [];
     this.dfilterDto.forEach((p:{id: number, name: string})=>{
        this.dateFilters.push({
           id:   p.id,
           name: p.name,
           selected: false
        });
      });
     this.onChange.emit({originalEvent: this.from,value: 0, datepicker: ""});
  }
  selectedCreatedDateFilter(dateId):void{
    this.createdDateFilterId = dateId;
    if(this.createdDateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.createdDateFilterId, datepicker: ""});
    }
  }
  selectedSubmittedDateFilter(dateId):void{
    this.submittedDateFilterId = dateId;
    if(this.submittedDateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.submittedDateFilterId, datepicker: ""});
    }
  }
  selectedWonDateFilter(dateId):void{
    this.wonDateFilterId = dateId;
    if(this.wonDateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.wonDateFilterId, datepicker: ""});
    }
  }
  selectedLostDateFilter(dateId):void{
    this.lostDateFilterId = dateId;
    if(this.createdDateFilterId != 7){
      this.onChange.emit({originalEvent: this.from,value: this.lostDateFilterId, datepicker: ""});
    }
  }

  onSelectMethod1($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('YYYY-MM-DD')});
  }
  onSelectMethod2($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('YYYY-MM-DD')});
  }
  onSelectMethod3($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('YYYY-MM-DD')});
  }
  onSelectMethod4($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('YYYY-MM-DD')});
  }
  onSelectMethod5($event) {  
    let d = new Date(Date.parse($event));
    this.onChange.emit({originalEvent: this.from,value: 7, datepicker: moment(d).format('YYYY-MM-DD')});
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

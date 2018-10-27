import { forwardRef,Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";


const DATE_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePicker),
    multi: true

};

declare var jQuery: any;

@Component({
    selector: 'my-datepicker',
    template: `<input #input type="text" style="width:100%;" class="date_picker form-control" >`,
    providers: [DATE_PICKER_VALUE_ACCESSOR]
})
export class DatePicker implements AfterViewInit {


    @ViewChild('input') input: ElementRef;
    @Input()value: string='';
    @Output() dateChange:EventEmitter<any> = new EventEmitter();
    private onTouched = () => { };
    private onChange: (value: string) => void = () => { };
    constructor(){
                   
    }
    writeValue(val:string){
       // console.log(this.value,'date-year-pick-val' );
        if(val!=null && val!= 'undefined'){
			if(val=='2017')  jQuery(this.input.nativeElement).datepicker('setDate', val);
           else{
		    var y = val.split('-');
            //console.log(y[0],'date-year-pick-val 2');
            this.value = y[0];
		   jQuery(this.input.nativeElement).datepicker('setDate', this.value); 
		   }
        }
                
    } 
    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
    ngAfterViewInit() {
        var self=this;
        jQuery(this.input.nativeElement).datepicker({
            format: "yyyy",
            minViewMode: "years", // or 1
            startDate: "2014",
            endDate: "2114",
            orientation: "bottom right",
            autoclose: true,
        }).on('changeDate',function(ev){
            self.onChange(ev);

            self.onTouched();
            var export_date = new Date(ev.date.setHours(ev.date.getHours() + 6));
            self.dateChange.emit(export_date);
            // console.log(ev.date);

        });
    }
}
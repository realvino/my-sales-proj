import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MileStoneStatusServiceProxy,CreateMileStoneStatusInput } from '@shared/service-proxies/service-proxies';
import { ColorPickerService, Rgba } from 'ngx-color-picker';



// import { MileStoneServiceProxy, MileStoneList, SourceTypees } from "shared/service-proxies/service-proxies";
const COLORS = [
  {'name': 'Blue 10', 'hex': '#C0E6FF'},
  {'name': 'Blue 20', 'hex': '#7CC7FF'},
  {'name': 'Blue 30', 'hex': '#5AAAFA'},
  {'name': 'Blue 40', 'hex': '#5596E6'},
  {'name': 'Blue 50', 'hex': '#4178BE'}
];
export interface SelectOption{
   id?: number;
   text?: string;
}
@Component({
    selector: 'createMileStoneStatus',
    templateUrl: './create-edit-mileStone.component.html',
    styles: [`colorbox,.colorbox { display:inline-block; height:14px; width:14px;margin-right:4px; border:1px solid #000;}`],
    encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class CreateOrEditMileStoneStatusComponent extends AppComponentBase implements OnInit {
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  private items:Array<any> = [];

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('milesourceCombobox') milesourceCombobox: ElementRef;

    milestone: CreateMileStoneStatusInput = new CreateMileStoneStatusInput();
    SelectedSourceId:number = 0; 
    SelectedSourceName:string = ""; 
    sourcetype:any = [];
    eventOriginal = this.milestone;
    selectedVal:boolean=false;
    active = false;
    saving = false;
    private sourcesType:Array<any>= [];
    active_source:SelectOption[]=[];

    constructor(
        injector: Injector,
        private _mileStoneProxyService: MileStoneStatusServiceProxy
    ) {
        super(injector);
    }
  public ngOnInit():any {
     this.milestone.color ='#fff';
          COLORS.forEach((color:{name:string, hex:string}) => {
      this.items.push({
        id: color.hex,
        text: `<colorbox style='background-color:${color.hex};'></colorbox>${color.name} (${color.hex})`
      });
    });
  }
   show(MileStone?: any): void {
	   this.milestone =new CreateMileStoneStatusInput();
	   this.milestone.color='';
        if(MileStone){
          this.milestone =MileStone;
        }
        this.SelectedSourceId = 0;
        this.SelectedSourceName = "";
        this.sourcetype = [];
        this.active_source = [];

        this.active = true;
        this.modal.show();
    }

   save(event): void {
        this.saving = true;
           if (this.milestone.id == null) {
               this.milestone.id = 0;
           }
		   //console.log(this.milestone);
       this._mileStoneProxyService.createOrUpdateMileStoneStatus(this.milestone)
            .finally(() => this.saving = false)
            .subscribe(() => {
               this.saving = false;
               this.notify.info(this.l('SavedSuccessfully'));
               this.milestone = this.eventOriginal;
               this.close();
               this.modalSave.emit(event.value);
            });

    }
    onShown(): void {
        // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }
    private get disabledV():string {
    return this._disabledV;
  }
  
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }



  onChangeColorHex8($event):void{

      this.milestone.color = $event;

  }

}

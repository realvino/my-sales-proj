import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalDirective,TabsetComponent } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { MilestoneServiceProxy, MileStoneListDto,CreateMileInputDto,MileStoneStatusServiceProxy,CreateMileStoneDetailInput } from "shared/service-proxies/service-proxies";
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
    selector: 'createMileStoneModal',
    templateUrl: './create-edit-mileStone.component.html',
    styles: [`colorbox,.colorbox { display:inline-block; height:14px; width:14px;margin-right:4px; border:1px solid #000;}`],
    styleUrls: ['./create-mile-stone.component.css'],
    encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class CreateOrEditMileStoneModalComponent extends AppComponentBase implements OnInit {
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  private items:Array<any> = [];
    filter:string='';
    statusId:number;
    public mileStatus:Array<any> = [];

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('milesourceCombobox') milesourceCombobox: ElementRef;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    //milestone: MileStoneListDto = new MileStoneListDto();
	milestone: CreateMileInputDto = new CreateMileInputDto();
    milestoneDetail:CreateMileStoneDetailInput=new CreateMileStoneDetailInput();

    //milestone:any=[];
    SelectedSourceId:number = 0; 
    SelectedSourceName:string = ""; 
    sourcetype:any = [];
    eventOriginal = this.milestone;
    selectedVal:boolean=false;
    active = false;
    saving = false;
    private sourcesType:Array<any>= [];
    active_source:SelectOption[]=[];
    public statuslist: Array<any>=[];
    public status: Array<any>=[];

    constructor(
        injector: Injector,
        private _mileStoneProxyService: MilestoneServiceProxy,
        private _milestatus:MileStoneStatusServiceProxy
    ) {
        super(injector);
    }
    public ngOnInit():any {
        COLORS.forEach((color:{name:string, hex:string}) => {
            this.items.push({
                id: color.hex,
                text: `<colorbox style='background-color:${color.hex};'></colorbox>${color.name} (${color.hex})`
            });
        });
    }
    show(MileStoneId?: number): void {
	    this.milestone =new CreateMileInputDto();
        this.getMilebyId(MileStoneId);
		this.getStatusbyMilestone();
        if(MileStoneId){
            this.getMilebyId(MileStoneId);
			if(this.milestone.id){
     			this.staticTabs.tabs[0].active = true;
            }	
        }
        this.active = true;
        this.modal.show();
    }
    doSomething(data): void {

    }
    removeSourceType(data):void{

    }
    save(): void {
        this.saving = true;
           if (this.milestone.id == null) {
               this.milestone.id = 0;
           }
           this.milestone.tenantId = abp.multiTenancy.getTenantIdCookie();
           this._mileStoneProxyService.createOrUpdateMilestone(this.milestone)
            .finally(() => this.saving = false)
            .subscribe(() => {
               this.notify.info(this.l('SavedSuccessfully'));
				this.milestone = this.eventOriginal;
				this.close();
				this.modalSave.emit(this.milestone); 
            });
    }
    onShown(): void {
        // $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        //this.milestone = this.eventOriginal;
    }
    private get disabledV():string {
      return this._disabledV;
    }
  
    private set disabledV(value:string) {
      this._disabledV = value;
      this.disabled = this._disabledV === '1';
    }
    public selected(value:any):void {
    //console.log('Selected value is: ', value);
    }

  public removed(value:any):void {
    //console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    //console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }

    getStatusbyMilestone():void{
        this._milestatus.getMileStoneStatus(this.filter).
            subscribe(result => {
                if(result.items != null){
                    this.statuslist=result.items;
                    this.status = [];
                    this.statuslist.forEach((company:{id:number, name:string}) => {
                        this.status.push({
                            id: company.id,
                            text: company.name
                        });
                    });
                }

            });

    }

    selectstatus(data): void {
        this.milestoneDetail.mileStoneStatusId = data.id;
        //this.milestone.mileStoneStatusId = data.id;

    }
    removestatus(data){
		//console.log(data);
		this.milestoneDetail.mileStoneId = null;
		
    }

    assignStatus(){

     if (this.milestoneDetail.id == null) {
            this.milestoneDetail.id = 0;
     }
     this.milestoneDetail.mileStoneId = this.milestone.id;
	 //console.log( this.milestoneDetail);
     this._mileStoneProxyService.createOrUpdateMileStoneDetail(this.milestoneDetail)
            .finally(() => this.saving = false)
            .subscribe(() => {

                this.notify.info(this.l('SavedSuccessfully'));
				 this.getMilebyId(this.milestone.id);
				 
               // this.modalSave.emit(this.milestoneDetail);
            });


    }
    removeStatusfromMile(item){
        this.message.confirm(
            this.l('Are you sure to Remove the Status' ,item.name),
                isConfirmed => {
                if (isConfirmed) {
                    this._mileStoneProxyService.getDeleteMileStoneDetail(item.id).subscribe(result=>{
                        if(this.message.error)
                        {
                            this.notify.error(this.l('This status could not delete'));
                        }else{
                            this.getMilebyId(this.milestone.id);
                        }
                    });
                }
            }
        );

    }

    getMilebyId(MileStoneId):void{
		
        this._mileStoneProxyService.getMilestoneForEdit(MileStoneId).subscribe((result) => {
            if (result.mileStones != null) {
				
                this.milestone = result.mileStones;
                this.mileStatus = result.mileStoneStatus;
                this.selectedVal =true;
            }
        });
    }
}

import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationStatusServiceProxy,CreateQuotationStatusInput, Select2ServiceProxy, Datadto } from 'shared/service-proxies/service-proxies';
export interface SelectOption {
    id?: number;
    text?: string;
}

@Component({
    selector: 'createQuotationStatusModal',
    templateUrl: './create-or-edit-quotationstatus.component.html'
})
export class CreateQuotationStatusComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    quotationstat: CreateQuotationStatusInput = new CreateQuotationStatusInput();
    eventOriginal = this.quotationstat;
    active = false;
    saving = false;

    milestones: Datadto[];
    milestone: Array<any>=[];
    active_mile:SelectOption[];
    statusArray:Array<any>;
    selected : string;

    constructor(
        injector: Injector,
        private _quotationstatusService: QuotationStatusServiceProxy,
        private _selectProxyService: Select2ServiceProxy
    ) {
        super(injector);
        this.statusArray = [{ 'id' : '1','name' : 'New' }, 
                            { 'id' : '2','name' : 'Submitted' },
                            { 'id' : '3','name' : 'Revised' },
                            { 'id' : '4','name' : 'Won' },
                            { 'id' : '5','name' : 'Lost' }
                           ];
    }

    show(quotationId?: number): void {
        this.quotationstat = new CreateQuotationStatusInput();
        this._selectProxyService.getQuotationMilestone().subscribe((result)=>{
            if(result.select2data != null){
                this.milestones = result.select2data;
                this.milestone = [];
                this.milestones.forEach((mile:{id:number, name:string}) => {
                    this.milestone.push({
                        id: mile.id,
                        text: mile.name
                    });
                });
            }
        });
        if(quotationId > 0){
            this._quotationstatusService.getQuotationStatusForEdit(quotationId).subscribe((result) => {
                if (result.quotationStatus != null) {
                   this.quotationstat = result.quotationStatus;
                   if(result.milestone){
                       this.active_mile = [{id: result.milestone.id, text: result.milestone.name}];
                   }
                   if(this.quotationstat.new){
                        this.selected = 'New';
                   }else if(this.quotationstat.submitted){
                        this.selected = 'Submitted';
                   }else if(this.quotationstat.revised){
                        this.selected = 'Revised';
                   }else if(this.quotationstat.won){
                        this.selected = 'Won';
                   }else if(this.quotationstat.lost){
                        this.selected = 'Lost';
                   }
                }
            });
        }
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;
           if (this.quotationstat.id == null) {
               this.quotationstat.id = 0;
           }
           this.quotationstat.tenantId  = abp.multiTenancy.getTenantIdCookie();
           this._quotationstatusService.createOrUpdateQuotationStatus(this.quotationstat)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.quotationstat = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.quotationstat);
            });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
        this.active_mile=[];
        this.selected='';
    }

    selectMilestone(data): void {
        this.quotationstat.mileStoneId = data.id;
    }
    removeMilestone(data?:any){
        this.quotationstat.mileStoneId = null;
    }
    radioChange(selectedId){
        if(selectedId == 1){
            this.quotationstat.new = true;
            this.quotationstat.submitted= false;
            this.quotationstat.revised = false;
            this.quotationstat.won = false;
            this.quotationstat.lost = false;
        }else if(selectedId == 2){
            this.quotationstat.submitted = true;
            this.quotationstat.new = false;
            this.quotationstat.revised = false;
            this.quotationstat.won = false;
            this.quotationstat.lost = false;
        }else if(selectedId == 3){
            this.quotationstat.revised = true;
            this.quotationstat.new = false;
            this.quotationstat.submitted= false;
            this.quotationstat.won = false;
            this.quotationstat.lost = false;
        }else if(selectedId == 4){
            this.quotationstat.won = true;
            this.quotationstat.new = false;
            this.quotationstat.submitted= false;
            this.quotationstat.revised = false;
            this.quotationstat.lost = false;
        }else if(selectedId == 5){
            this.quotationstat.lost = true;
            this.quotationstat.new = false;
            this.quotationstat.submitted= false;
            this.quotationstat.revised = false;
            this.quotationstat.won = false;
        }
    }
}

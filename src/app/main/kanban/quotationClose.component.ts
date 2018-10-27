import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateQuotationInput, QuotationServiceProxy, Datadto, Select2ServiceProxy, EnquiryServiceProxy, EnquiryQuotationKanbanUpdateInput } from 'shared/service-proxies/service-proxies';

export interface SelectOption {
    id?: number;
    text?: string;
}

@Component({
    selector: 'quotationCloseModal',
    templateUrl: './quotationClose.component.html'
})
export class QuotationCloseComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    active = false;
    saving = false;

    statusArray:Array<any>;
    selected : string;
    quotation_input:CreateQuotationInput = new CreateQuotationInput();
    quotationUpdate_input:EnquiryQuotationKanbanUpdateInput = new EnquiryQuotationKanbanUpdateInput();
    active_reason:SelectOption[];
    active_competitor:SelectOption[];
    reason:Array<any>=[];
    reasonData:Datadto[];
    competitor:Array<any>=[];
    competitorData:Datadto[];
    ended:boolean=false;
    constructor(
        injector: Injector,
        private _quotationService: QuotationServiceProxy,
        private _selectService: Select2ServiceProxy,
        private _enquiryService: EnquiryServiceProxy
    ) {
        super(injector);
    }

    show(quotationId?: number, fromMileStone?:string, toMileStone?:string ): void {
        this.quotationUpdate_input.quotationId= quotationId;
        this.quotationUpdate_input.currentMilestone = fromMileStone;
        this.quotationUpdate_input.updateMilestone = toMileStone;
        
        this.quotation_input = new CreateQuotationInput();
        this._quotationService.getQuotationForEdit(quotationId).subscribe((result) => {
            if (result.quotations != null) {
               this.quotation_input = result.quotations;
               if(!this.quotation_input.submitted){
                   this.notify.error(this.l('Please Submit the Quotation and then move'))
               }
               if(this.quotation_input.won || this.quotation_input.lost){
                  this.notify.error("This Quotation has ended and cannot be moved");
                  this.ended=true;
               }
            }
            this.statusArray = [];
            this._selectService.getQuotationStatus().subscribe((result) => {
            if(result.select3data != null){
                result.select3data.forEach((status:{id:number, name:string, code: string})=>{
                    if(status.code == 'Won' || status.code == 'Lost'){
                        this.statusArray.push({
                            id: status.id,
                            name: status.name,
                            code: status.code
                        });
                    }
                });
                this.statusArray.push({
                    id: 0,
                    name: 'Avoid',
                    code: 'Avoid'
                });
            }
            });
            this.active = true;
            this.modal.show();
        });
    }

    save(): void {
        this.saving = true;
        if(this.selected == 'Avoid'){
            this._enquiryService.enquiryQuotationKanbanUpdateAsync(this.quotationUpdate_input)
            .finally(()=> this.saving=false)
            .subscribe(()=>{
                this.notify.success("Quotation Moved Successfully");
                this.close();
            }); 
        }
        else{
            this._quotationService.createOrUpdateQuotation(this.quotation_input)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.success(this.l('Quotation Status Changed Successfully'));
                this.close();
            });
        }
        
    }

    onShown(): void {
    }
    close(): void {
        this.active = false;
        this.quotation_input = new CreateQuotationInput();
        this.active_competitor = [];
        this.active_reason = [];
        this.selected = '';
        this.ended=false;
        this.modalSave.emit();
        this.modal.hide();
    }

    radioChange(selectedStatus){
        if(selectedStatus.code == 'Won'){
            this.quotation_input.statusId = selectedStatus.id;
            this.quotation_input.won = true;
            this.quotation_input.lost = false;
        }else if(selectedStatus.code == 'Lost'){
            this.quotation_input.statusId = selectedStatus.id;
            this.quotation_input.lost = true;
            this.quotation_input.won = false;
            this.quotation_input.customerPONumber=null;
            this.quotation_input.salesOrderNumber=null;
            this._selectService.getReason().subscribe(result=>{
                if(result.select2data!=null){
                    this.reasonData = result.select2data;
                    this.reason = [];
                    this.reasonData.forEach((rea:{id:number,name:string})=>{
                        this.reason.push({
                            id:rea.id,
                            text:rea.name
                        });
                    });
                }
            });
        
            this._selectService.getCompetitor().subscribe(result=>{
                if(result.select2data!=null){
                    this.competitorData = result.select2data;
                    this.competitor = [];
                    this.competitorData.forEach((compet:{id:number,name:string})=>{
                        this.competitor.push({
                            id:compet.id,
                            text:compet.name
                        });
                    });
                }
            });

        }
        else{
            this.quotation_input.won = false;
            this.quotation_input.lost = false;
            this.quotation_input.customerPONumber=null;
            this.quotation_input.salesOrderNumber=null;
            this.quotation_input.reasonId=null;
            this.quotation_input.competitorId=null;
        }
    }
    selectedReason(data){
        this.quotation_input.reasonId=data.id;
    }
    removedReason(){
        this.quotation_input.reasonId=null;
    }
    selectedCompetitor(data){
        this.quotation_input.competitorId=data.id;
    }
    removedCompetitor(){
        this.quotation_input.competitorId=null;
    }
    isValidSave(){
        if(this.quotation_input.lost == true){
            if(!this.quotation_input.reasonId || !this.quotation_input.competitorId || !this.quotation_input.submitted){
              return true;
            }
            else{
              return false;
            }
        }
        else if(this.quotation_input.won == true){
            if(!this.quotation_input.salesOrderNumber || !this.quotation_input.customerPONumber || !this.quotation_input.submitted){
               return true;
            }
            else{
               return false;
            }
        }
        else if(this.selected == 'Avoid'){
            return false;
        }
        else{
            return true;
        }
    }

}

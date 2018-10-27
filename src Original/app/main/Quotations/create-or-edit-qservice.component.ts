import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuotationServiceProxy,Select2ServiceProxy,CreateQuotationServiceInput, UpdateQuotationTotal, QuotationServiceList } from "shared/service-proxies/service-proxies";

export interface SelectOption {
    id?: number;
    text?: string;
}

@Component({
    selector: 'createQServiceModal',
    templateUrl: './create-or-edit-qservice.component.html'
    // styleUrls : ['./create-or-edit-qservice.component.css']
})
export class CreateEditqserviceComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    @Output() messageEvent = new EventEmitter<string>();

    saving = false;
    qservice:Array<any>=[];
    qservices:Array<any>=[];
    active_qservice:SelectOption[];
    qser_input:CreateQuotationServiceInput=new CreateQuotationServiceInput();
    qser_edit:QuotationServiceList = new QuotationServiceList();
    quttot:UpdateQuotationTotal=new UpdateQuotationTotal();
    quotation:number;

    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _quotationProxy:QuotationServiceProxy
    ) {
        super(injector);
    }

    show(quotation?:any,qservice?:any): void {
        //console.log(quotation);
        this.quotation=quotation;
        this.qser_input=new CreateQuotationServiceInput();
        this.quttot=new UpdateQuotationTotal();
        this.modal.show();
        if(qservice === undefined){
            this.qser_input.price=null;
            this.qser_input.serviceId=null;
            this.active_qservice=[];
            this.getQServiceData();
        }
        else
        {
            this._quotationProxy.getQuotationServiceForEdit(qservice).subscribe((res)=>{
                this.qser_edit=res.quotationServices;
                this.qser_input.serviceId = this.qser_edit.serviceId;
                this.qser_input.id=this.qser_edit.id;
                this.qser_input.quotationId=this.qser_edit.quotationId;
                this.qser_input.covertPrice=this.qser_edit.covertPrice;
                this.qser_input.tenantId=this.qser_edit.tenantId;
                this.getQServiceData();
            });
        }
    }
    
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    selectedCode(data){
        this.qser_input.serviceId=data.id
    }

    close(): void {
        this.modal.hide();
        this.active_qservice=[];
        this.qser_input.price=null;
        this.qser_input.serviceId=null;
        this.qser_input.covertPrice=null;
    }

    getQServiceData(){
        this._selectProxyService.getService().subscribe((res)=>{
            if(res.select2data!=null){
                this.qservice = res.select2data;
                this.qservices = [];
                this.qservice.forEach((serv:{id:number,name:string})=>{
                    if(this.qser_input.serviceId==serv.id){
                        this.active_qservice=[{id:serv.id,
                            text:serv.name}];
                    }
                    this.qservices.push({
                        id:serv.id,
                        text:serv.name
                    });
                });
            }
        });
    }
	
    save(): void {
        this.saving = true;
        if(!this.qser_input){
            this.qser_input.id =0;
        }
        this.quttot.quotationId = this.quotation;
        this.qser_input.tenantId = abp.multiTenancy.getTenantIdCookie();
        this.qser_input.quotationId=this.quotation;
        this.qser_input.price = this.qser_input.covertPrice;
        this._quotationProxy.createOrUpdateQuotationService(this.qser_input).finally(() => this.saving = false)
        .subscribe(() => {
            this.notify.success(this.l('SavedSuccessfully'));
            this._quotationProxy.updateQuotationTotal(this.quttot).finally(() => this.saving = false)
            .subscribe(() => {
               let message ='yes';
               this.messageEvent.emit(message);
             });
            this.close();
            this.modalSave.emit(this.qser_input.quotationId);
            this.active_qservice=[];
            this.qser_input.price=null;
            this.qser_input.serviceId=null;
            this.qser_input.covertPrice=null;
          //  this.pro_input.priceLevelId

        });
    }
}
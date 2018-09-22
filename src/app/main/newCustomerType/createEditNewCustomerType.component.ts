import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {CustomerTypeServiceProxy,NewCustomerTypeInputDto} from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'createNewCustomerTypeModal',
    templateUrl: './createEditNewCustomerType.component.html'
})
export class CreateOrEditNewCustomerTypeComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    customertype: NewCustomerTypeInputDto = new NewCustomerTypeInputDto();
    eventOriginal = this.customertype;


    custype = ["Company", "Contact"];
    custselect = "Company";

    active = false;
    saving = false;


    constructor(injector: Injector,private _customerTypeProxyService: CustomerTypeServiceProxy) {

        super(injector);


    }

   show(customertypeId?: number): void {

       let self = this;
       self.active = true;
       self.modal.show();

       this._customerTypeProxyService.getNewCustomerTypeForEdit(customertypeId).
           subscribe((result) => {
            if(result.newCustomerTypes!=null){
               this.customertype=result.newCustomerTypes;
			 
               if(this.customertype.company == true)
               {
                   this.custselect ="Company";
               }
               else{
                   this.custselect ="Contact";
               }
              } 

           });


    }

    

   save(): void {

       this.modal.hide();
       this.active = false;
       //createOrUpdateNewCustomerType

       this.saving = true;
       if (this.customertype.id == null) {
           this.customertype.id = 0;
       }


       if(this.custselect == "Company")
       {
           this.customertype.company = true;
       }
       else{
           this.customertype.company = false;
       }
       this.customertype.tenantId=abp.multiTenancy.getTenantIdCookie();
	     
       this._customerTypeProxyService.createOrUpdateNewCustomerType(this.customertype)
           .finally(() => this.saving = false)
           .subscribe(() => {
               this.notify.info(this.l('SavedSuccessfully'));
               this.customertype = this.eventOriginal;
               this.customertype.title='';
               this.custselect = "Company";
               this.close();
               this.modalSave.emit(this.customertype);
           });


    }
    onShown(): void {

        $(this.nameInput.nativeElement).focus();

    }
    close(): void {

        this.modal.hide();
        this.customertype.title='';
        this.custselect = "Company";
        this.active = false;

    }




}

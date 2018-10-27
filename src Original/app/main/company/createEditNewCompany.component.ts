import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CompanyContactServiceProxy,CreateCompanyOrContact } from '@shared/service-proxies/service-proxies';
import { Select2ServiceProxy,Datadto } from "shared/service-proxies/service-proxies";
//import { CreateOrEditCompanyContactModalComponent } from "app/main/company/create-edit-companycontact.component";


export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createCompanyModal',
    templateUrl: './createEditNewCompany.component.html'
})
export class CreateOrEditCompanyComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    //@ViewChild('createCompanyContactModal') createCompanyContactModal: CreateOrEditCompanyContactModalComponent;

    custype = ["Addressinfo", "ContactInfo"];
    custselect = "Addressinfo";

    infotype: CreateCompanyOrContact = new CreateCompanyOrContact();
    eventOriginal = this.infotype;
    active = false;
    saving = false;
    public companytypes: Array<any>=[];
    public companytypo:Array<any> =[];
    public countrylist: Array<any>=[];
    public country:Array<any> =[];
    public currencylist: Array<any>=[];
    public currency:Array<any> =[];

    enable_save : boolean = true;

    constructor(
        injector: Injector,
        private _companyProxyService: CompanyContactServiceProxy,
        private _selectProxyService: Select2ServiceProxy
    ) {
        super(injector);
    }

    show(infotypeId?: number): void {

        this.custselect = "Addressinfo";
        this.active = true;
        this.infotype= new CreateCompanyOrContact();
        this.modal.show();
        this.infotype.id = infotypeId;

        this._selectProxyService.geCompanyType().
            subscribe((result)=>{
                  if(result.select2data != null){

                      this.companytypes=result.select2data;
                      this.companytypo = [];
                      this.companytypes.forEach((company:{id:number, name:string}) => {
                          this.companytypo.push({
                              id: company.id,
                              text: company.name
                          });
                      });
                  }


            });


        this._selectProxyService.getCurrency().
            subscribe((result)=>{

                if(result.select3data != null){

                    this.currencylist=result.select3data;
                    this.currency = [];
                    this.currencylist.forEach((company:{id:number, name:string}) => {
                        this.currency.push({
                            id: company.id,
                            text: company.name
                        });
                    });
                }
        });

        this._selectProxyService.getCountry().
            subscribe((result)=>{
                if(result.select2data != null){

                    this.countrylist=result.select2data;
                    this.country = [];
                    this.countrylist.forEach((company:{id:number, name:string}) => {
                        this.country.push({
                            id: company.id,
                            text: company.name
                        });
                    });

                }


            });
     /*   this._companyProxyService.getNewInfoTypeForEdit(infotypeId).
            subscribe((result) => {
                if(result.newInfoTypes != null){

                    this.infotype=result.newInfoTypes;
                    if(this.infotype.info == true)
                    {
                        this.custselect ="Addressinfo";
                    }
                    else{
                        this.custselect ="ContactInfo";
                    }
                }
            });
*/

    }



    save(): void {

        this.saving = true;
      	if (this.infotype.id == null) {
            this.infotype.id = 0;
        }
        //console.log(this.infotype);
        this._companyProxyService.createOrUpdateCompanyOrContact(this.infotype)
            .finally(() => this.saving=false )
            .subscribe((result) => {


                this.notify.info(this.l('Saved Successfully'));
                this.infotype = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.infotype);

            },
            (error)=>{
                this.notify.error(this.l(error.details));
            });

    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }

    doSomething(data): void {
        this.infotype.customerTypeId = data.id;
        if( this.infotype.name == '' || this.infotype.name == null || this.infotype.name == undefined  || this.infotype.customerTypeId ==undefined || this.infotype.customerTypeId == null || this.infotype.countryId == undefined || this.infotype.countryId == null || this.infotype.currencyId == null || this.infotype.currencyId == undefined) this.enable_save=true;
        else this.enable_save=false;
    }
    removeType(data?:any){
        this.infotype.customerTypeId= null;
        this.enable_save= true;
    }

    selectCountry(data): void {
        this.infotype.countryId = data.id;
        if( this.infotype.name == '' || this.infotype.name == null || this.infotype.name == undefined  || this.infotype.customerTypeId ==undefined || this.infotype.customerTypeId == null || this.infotype.countryId == undefined || this.infotype.countryId == null || this.infotype.currencyId == null || this.infotype.currencyId == undefined) this.enable_save=true;
        else this.enable_save=false;
    }
    removeCountry(data?:any){
        this.infotype.countryId = null;
        this.enable_save= true;

    }

    selectCurrency(data): void {
        this.infotype.currencyId = data.id;
        if( this.infotype.name == '' || this.infotype.name == null || this.infotype.name == undefined  || this.infotype.customerTypeId ==undefined || this.infotype.customerTypeId == null || this.infotype.countryId == undefined || this.infotype.countryId == null || this.infotype.currencyId == null || this.infotype.currencyId == undefined) this.enable_save=true;
        else this.enable_save=false;
    }
    removeCurrency(data?:any){
        this.infotype.currencyId= null;
        this.enable_save= true;
    }

    companyNameChange(data){

        //console.log(this.infotype.customerTypeId);

        if( data.trim() == ''  || this.infotype.customerTypeId ==undefined || this.infotype.customerTypeId == null || this.infotype.countryId == undefined || this.infotype.countryId == null || this.infotype.currencyId == null || this.infotype.currencyId == undefined) this.enable_save=true;
        else this.enable_save=false;
    }
}
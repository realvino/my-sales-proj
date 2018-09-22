import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router,ActivatedRoute } from "@angular/router";

import { CompanyContactServiceProxy, Select2ServiceProxy,CreateCompanyOrContact,Datadto } from "shared/service-proxies/service-proxies";
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    selector: 'createNewContactModal',
    templateUrl: './create-edit-contact.component.html'
})
export class CreateOrEditContactNewModalComponent extends AppComponentBase  {


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;

    act_comp:SelectOption[]=[];
    companys:Datadto[];
    types:Datadto[];
    comp_disabled:boolean=false;
    SelectedContactName:string = "";
    plusvalid:boolean=false;
    private items:Array<any> = [];
    private itemss:Array<any> = [];
	  private title:Array<any> = [];
    private value:any = {};
    contact: CreateCompanyOrContact = new CreateCompanyOrContact();

    eventOriginal = this.contact;

    active = false;
    saving = false;
    enq_id:number=0;
    comp_id:number=0;
    come_from:string = "";
	  /*contactInput:EnquiryContactInputDto = new EnquiryContactInputDto();*/
	  public pathname:string='';
    public addcontact:boolean=false;
    private indus:Array<any>=[];
    allIndustry:Datadto[];
    constructor(
        injector: Injector,
        private _companyService: CompanyContactServiceProxy,
        private _select2Service: Select2ServiceProxy,
        private _activatedRoute: ActivatedRoute,
		    // private _enquiryContactServiceProxy: EnquiryContactServiceProxy,
        private router:Router

    ) {
        super(injector);
        /*this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];   //<----- + sign converts string value to number
            this.enq_id = +params['enId'];
        });*/
    }

   show(companyId?: number,enquiryId?:number,type?:string): void {

       this.contact = new CreateCompanyOrContact();
        
         this.enq_id = enquiryId; 
		 this.pathname = window.location.href;
       
		if(this.pathname.indexOf('main/kanban/')!== -1){
		    this.addcontact=true;
		}

        this.come_from = type;
        this.comp_id = companyId;
           this._select2Service.getContactType().subscribe((result) => {
           if (result.select2data != null) {
            this.types = result.select2data;
            this.items=[];
              this.types.forEach((customer:{id:number, name:string}) => {
              this.items.push({
              id: customer.id,
              text: customer.name
              });
             });
            } });
         this._select2Service.getCompany().subscribe((result) => {
           if (result.select2data != null) {
            this.types = result.select2data;
            this.itemss=[];
              this.types.forEach((company:{id:number, name:string}) => {
              this.itemss.push({
              id: company.id,
              text: company.name
              });
              if(company.id==companyId){
                this.act_comp = [{id:company.id,text:company.name}];
                this.comp_disabled = true;
                this.contact.companyId=companyId;
              }
             });
            }
            
        });
		this._select2Service.getTitle().subscribe((result) => {
            if (result.select2data != null) {
              this.types = result.select2data;
              this.title=[];
                this.types.forEach((tit:{id:number, name:string}) => {
                  this.title.push({
                    id: tit.id,
                    text: tit.name
                  });
                });
            } 
		});
        this.active = true;
        this.modal.show();
             
    }

public refreshCompany(value:any):void {
    this.value = value;
  }
public removedCompany(value:any):void {
    //console.log('Removed value is: ', value);
    this.contact.companyId= 0;
    //this.plusvalid=false;
  }
public typedCompany(event):void {
  var value = event.target.value;
  //console.log(value);
          for(let i=0;i<this.itemss.length;i++)
          {
               if(value.toLowerCase()==this.itemss[i].text.toLowerCase()||value==""){
                        this.plusvalid=false;
                        break;
               }
               else{                   
                   this.plusvalid=true;
                   //this.country.countryName = value;
               }
           } 
  }
  public refreshCustomerTypeValue(value:any):void {
    this.value = value;
  }
public removedCustomerType(value:any):void {
    //console.log('Removed value is: ', value);
    this.contact.customerTypeId=0;
    //this.plusvalid=false;
  }
public selectedCompany(value:any):void {
        this.contact.companyId=value.id;
        //this.plusvalid=false;
    }
    public selectedCustomerType(value:any):void {
        this.contact.customerTypeId=value.id;
        this.plusvalid=false;
    }
	
	public refreshTitle(value:any):void {
         this.value = value;
    }
    public removedTitle(value:any):void {
         //console.log('Removed value is: ', value);
    }
    public selectedTitle(value:any):void {
		//this.titles.id = this.value;
        this.contact.titleId = value.id;
		//console.log('Selected value is: ', value);
        
    }
   save(form): void {
        this.saving = true;
           if (this.contact.id == null) {
               this.contact.id = 0;
           }
           //this.contact.name=this.SelectedContactName;
		   //console.log(121,this.contact);
		     this._companyService.createOrUpdateCompanyOrContact(this.contact)
			 .finally(() => this.saving = false)
            .subscribe((result) => {
				this.notify.info(this.l('Saved Successfully'));
                this.contact = this.eventOriginal;
                this.close(form);
                this.modalSave.emit(this.contact);
                //console.log(result);
                if(this.come_from=='company'){
                this.router.navigate(['app/main/company/contact/'+result,this.comp_id]);
              }else if(this.come_from=='enquiry'){
                  this.router.navigate(['app/main/contact/'+result,this.enq_id]);
                }else{
                  this.router.navigate(['app/main/contact/'+result,0]);
                }
            
			/*if(this.addcontact){

					this.contactInput.contactId = result;
					this.contactInput.inquiryId = this.enq_id;
					this.updateLinkedContact();
                 }*/
			});
              
    }
    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
	
    close(form): void {
        form.resetForm();
        this.modal.hide();
        this.active = false;
        this.plusvalid=false;
        this.comp_disabled = false;
        this.act_comp =[];
    }
	/*updateLinkedContact(){
		this.contactInput.id = 0;
               
			this._enquiryContactServiceProxy.createOrUpdateEnquiryContact(this.contactInput)
			.subscribe(() => {
				this.notify.info(this.l('SavedSuccessfully'));
			});
		
	}*/
}

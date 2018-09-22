import { Component, ChangeDetectorRef,OnInit, Injector,AfterViewInit,ViewChild,EventEmitter,Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './customer.interface';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { Router,ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { Select2ServiceProxy,CompanyContactServiceProxy,CreateCompanyOrContact,CreateAddressInfo,CreateContactInfo,NewContactListDto,Datadto  } from "shared/service-proxies/service-proxies";
import { CreateOrEditContactNewModalComponent } from "app/main/contact/create-edit-contact.component";
export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    templateUrl: './newCompany.component.html',
    styleUrls: ['./custom.component.css'],
    animations: [appModuleAnimation()]
})
export class newCompanyComponent extends AppComponentBase implements OnInit,AfterViewInit {
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('createNewContactModal') createNewContactModal: CreateOrEditContactNewModalComponent;
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  initData:number=0;
  addinitData:number=0;
  values_arr:any=[];
  contact_arr:any=[];
	public countrylist: Array<any>=[];
    public country:Array<any> =[];
    public currencylist: Array<any>=[];
    public currency:Array<any> =[];
	active = false;
  
  removed_address_arr:any=[];
  remove_contact_arr:any=[];
  private companytypes:Array<any> = [];

   active_company:SelectOption[];
   public myForm: FormGroup;
   cusTypeId:number=0;
   cmpname:string='';
   formdata:any=[];
   dataCon: any=[];
    companytypo:any=[];
   contact_remove_values:any=[];
   address_remove_values:any=[];
    sales:Datadto[];
    sale:any=[];
   id:number=0;
   enq_id:number=0;
   saving:boolean=true;
   company: CreateCompanyOrContact = new CreateCompanyOrContact();
   eventOriginal = this.company;
   
    set_opacity:string='1';
    active_managed:SelectOption[]=[];
    active_sale:SelectOption[]=[];
	active_currency:SelectOption[]=[];
    active_country:SelectOption[]=[];
    managedId:number=0;
	curId:number=0;
	cntyId:number =0;
    private managedBy:Array<any> = [];
    address:CreateAddressInfo =new CreateAddressInfo();
    contact:CreateContactInfo= new CreateContactInfo();
    companyContact:NewContactListDto[];
   constructor(
        injector: Injector,
        private _http: Http,
        private _fb: FormBuilder,
        private _cfb: FormBuilder,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private _newCompanyContactServiceProxy:CompanyContactServiceProxy,
        private _selectServiceProxy:Select2ServiceProxy

    )
    {
        super(injector); 
        this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];   //<----- + sign converts string value to number
            this.enq_id = +params['enId'];
        });


    }

       ngOnInit() {

           this.contact_remove_values =[];
           this.address_remove_values=[];
           this.dataCon=[];
           this.formdata=[];
           this.cusTypeId=null;

          /* this.opts = {
               position: 'right',
               barBackground: 'grey',
               barWidth:'7',
               gridWidth:'5',
               gridBackground:'white'

           }*/
           this._newCompanyContactServiceProxy.getCompanyForEdit(this.id).subscribe((result)=>{
              //console.log(result,'compedit');
               if(result!=null){
				  
                   this.formdata=result[0].addressInfo;
                   this.dataCon = result[0].contactinfo;
                   this.cmpname = result[0].name;
				   //console.log(this.cmpname);
                   this.cusTypeId = result[0].newCustomerTypeId;
                   this.managedId = result[0].accountManagerId;
				   this.curId = result[0].currencyId;
				   this.cntyId = result[0].countryId;
				   this.company.name = this.cmpname;
                   //console.log(result[0],45);
                   this.company.countryId = this.cntyId;
                   this.company.currencyId = this.curId;
                   this.company.customerTypeId = this.cusTypeId;
                   this._selectServiceProxy.geCompanyType().
                       subscribe((result)=>{
                           if(result.select2data != null){

                               this.companytypes=result.select2data;
                               //console.log(   this.companytypes,'company');
                               this.companytypo = [];
                               this.companytypes.forEach((company:{id:number, name:string}) => {
                                   this.companytypo.push({
                                       id: company.id,
                                       text: company.name
                                   });

                                   if(this.cusTypeId===company.id){
                                       this.active_company = [{id:company.id,text:company.name}];
                                       this.company.customerTypeId =company.id;
                                   }
                               });
                           }

                       });
					  
					   
                  this.myForm = this.showing();
                  this.addAddress(0);
                  // // add contact
                  this.addContacts(0);
                   this.getManager();
				   this.getcurrency();
				   this.getcountry();

               }
             
           });
            this.myForm = this._fb.group({
                  companyName: [this.cmpname,[Validators.required]],
                  typeid: 0,
                  managed:0,
                  addresses: this._fb.array([]),
                  contacts: this._cfb.array([]),
              });
              this.addAddress(0);
              // // add contact
              this.addContacts(0);
              this.getCompanyCon();
       }
       showing(){

        return this._fb.group({
            companyName: [this.cmpname, [Validators.required]],
            typeid: this.cusTypeId,
            managed:this.managedId,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([]),
           // empaddress:this._fb.array([])
        });
        
       }
    initContact(){
         return this._cfb.group({
            id:0,
            contactinfo: [''],
            infoid: null
        });
    }
    addContacts(data) {
        //this.dataCon = [ {id:1,contactinfo: 'NagerCoil',infoid: 1,name:'Email'},{id:2,contactinfo: 'Chennai',infoid: 4,name:'Fax'}];
        const con = <FormArray>this.myForm.controls['contacts'];
         const addCon = this.initContact();
         if(this.dataCon.length>=1 && !data){

          this.dataCon.forEach((country:{infoData:string, infoTypeId:number,id:number})=>{
              con.push(
                this._cfb.group({
                    id:country.id,
                    contactinfo: [country.infoData],
                    infoid: country.infoTypeId
                })
              )
          });
            return 1;
         }
         con.push(addCon);
        // console.log(this.myForm.controls['contacts']);
        }
    removeContacts(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['contacts'];
        this.contact_remove_values.push(data._value);
        control.removeAt(i);
    }
    initAddress() {
      
        return this._fb.group({
            id:0,
            street: ['', Validators.required],
            postcode: [''],
            cityid: null,
            typeid: null,
            company:this.id,
            country:['']
        });
    }

    addAddress(data) {
        const control = <FormArray>this.myForm.controls['addresses'];
        const addrCtrl = this.initAddress();
        if(this.formdata.length>=1 && !data){
            //this.formdata = [{id:1,street:'NGO Colony',postcode:'629502',cityid:1,typeid:6},{id:2,street:'Beach Road',postcode:'629503',cityid:2,typeid:5},{id:3,street:'Anna Salai',postcode:'600028',cityid:3,typeid:7}];
            this.formdata.forEach((country:{id:number,address1:string, address2:string,infoTypeId:number,companyId:number,countryName:string}) =>{
            control.push(this._fb.group({
            id: country.id,  
            street: [country.address1, Validators.required],
            postcode: [country.address2],
            typeid: country.infoTypeId,
            company:country.companyId,
        }))
            });

         return 1;
        }
        control.push(addrCtrl);
    }
    removeAddress(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['addresses'];
        this.address_remove_values.push(data._value);
        control.removeAt(i);
    }    
    ngAfterViewInit(): void {

    }
    getCompanyCon(){
      this._newCompanyContactServiceProxy.getCompanyContacts(this.id).subscribe((result)=>{
		  //console.log(result,123);
          if(result.items!=null){
              this.companyContact = result.items;
              //console.log(result.items);
          }
      });
    }
    goToCompany(){
      this.router.navigate(['/app/main/company']);
    }
    save(model){

      this.values_arr=[];
      this.contact_arr=[];
        for(var i=0;i<model.value.addresses.length;i++){
            if(model.value.addresses[i].id==0 || model.value.addresses[i].street!=this.formdata[i].address1 || model.value.addresses[i].postcode!=this.formdata[i].address2 || 
               model.value.addresses[i].typeid!=this.formdata[i].infoTypeId){
              // this.values_arr.push(model.value.addresses[i]);
              this.address.id = model.value.addresses[i].id;
              this.address.companyId =this.id;
              this.address.infoTypeId = model.value.addresses[i].typeid;
              this.address.address1 = model.value.addresses[i].street;
              this.address.address2 = model.value.addresses[i].postcode;
              this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{
              
                  //console.log(result,'address create id');
              });
            }
            
        }
        for(var i=0;i<model.value.contacts.length;i++){
            if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!=this.dataCon[i].infoData || model.value.contacts[i].infoid!=this.dataCon[i].infoTypeId ){
              this.contact_arr.push(model.value.contacts[i]);
              this.contact.id =model.value.contacts[i].id;
              this.contact.companyId =this.id;
              this.contact.infoTypeId = model.value.contacts[i].infoid;
              this.contact.infoData = model.value.contacts[i].contactinfo;
              this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
                  //console.log(result,'contact create id');
              });
            }
        }
        if(this.address_remove_values.length>1){
          this.address_remove_values.forEach((add:{id:number})=>{
              this._newCompanyContactServiceProxy.getDeleteAddressInfo(add.id).subscribe(result=>{

              });
          });
        }
        if(this.contact_remove_values.length>1){
          this.contact_remove_values.forEach((con:{id:number})=>{
            this._newCompanyContactServiceProxy.getDeleteContactInfo(con.id).subscribe(result=>{

            });
          });
        }
        if(this.company.accountManagerId == 0){
            this.company.countryId = null;
        }
        if(this.company.accountManagerId == 0){
            this.company.currencyId = null;
        }
        if(this.company.accountManagerId == 0){
            this.company.accountManagerId = null;
        }
        this.company.id = this.id;
        this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.company)
            .finally(() => this.saving = false)
            .subscribe((result) => {

                this.notify.info(this.l('Saved Successfully'));
				this.company = this.eventOriginal;
                this.close();
                this.modalSave.emit(this.company);
            },
            (error)=>{
                this.notify.error(this.l(error.details));
            });
    }
	
	 close(): void {
        //this.modal.hide();
        this.active = false;
    }
    createContact(){
      this.createNewContactModal.show(this.id,0,'company');
    }
    selectManagedBy(data){
        this.company.accountManagerId=data.id;
    }
    removeManagedBy(data){
        this.company.accountManagerId=null;
    }
    selectType(data){
        this.company.customerTypeId=data.id;
    }

    removeType(data){
        this.company.customerTypeId=null;
    }
    getManager(){
        this._selectServiceProxy.getSalesPerson().
            subscribe((result)=>{
				//console.log(result,'sales');
                if(result.select2data != null){
					this.sales=result.select2data;
                    this.sale = [];
                    this.sales.forEach((sale:{id:number, name:string}) => {
                        this.sale.push({
                            id: sale.id,
                            text: sale.name
                        });
						if(this.managedId===sale.id){
                            this.active_sale = [{id:sale.id,text:sale.name}];
                            this.managedId =sale.id;
                        }
                    });
                }

            });
    }
	getcurrency(){
	 this._selectServiceProxy.getCurrency().
            subscribe((result)=>{
				
				 if(result.select3data != null){
						
                    this.currencylist=result.select3data;
                    this.currency = [];
                    this.currencylist.forEach((company:{id:number, name:string}) => {
                        this.currency.push({
                            id: company.id,
                            text: company.name
                        });
						if(this.curId===company.id){
                            this.active_currency = [{id:company.id,text:company.name}];
                            this.curId =company.id;
                        }
						
                    });
                } 

	});
	
	}
	getcountry(){
		
		 this._selectServiceProxy.getCountry().
            subscribe((result)=>{
                
				
                if(result.select2data != null){

                    this.countrylist=result.select2data;
					
                    this.country = [];
                    this.countrylist.forEach((company:{id:number, name:string}) => {
                        this.country.push({
                            id: company.id,
                            text: company.name
                        });
						if(this.cntyId===company.id){
							
							this.active_country=[{id:company.id,text:company.name}];
							this.cntyId =company.id;
						}
                    });
					

                }

            });
	}
	
	selectCountry(data): void {
        this.company.countryId = data.id;
    }
    removeCountry(data?:any){
        this.company.countryId = null;
    }

    selectCurrency(data): void {
        this.company.currencyId = data.id;
    }
    removeCurrency(data?:any){
        this.company.currencyId= null;
    }
    editContact(data): void {
        //console.log(data);
        this.router.navigate(['app/main/contact/'+data.id,0]);
       }
    deleteContact(contact: NewContactListDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Contact', contact.contactName),
                isConfirmed => {
                if (isConfirmed) {
                    this._newCompanyContactServiceProxy.getDeleteContact(contact.id).subscribe(() => {
                        this.getCompanyCon();
                        this.notify.success(this.l('Deleted Successfully'));
                        //_.remove(this.contacts, contact_data);
                    });
                }
            }
        );
    }

}
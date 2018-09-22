import { Component, ChangeDetectorRef,OnInit, Injector,AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './customer.interface';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { Router,ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { Select2ServiceProxy, Datadto,CompanyContactServiceProxy,CreateAddressInfo,CreateContactInfo,CreateCompanyOrContact } from "shared/service-proxies/service-proxies";

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    templateUrl: './newContact.component.html',
    styleUrls: ['./custom.component.css'],
    animations: [appModuleAnimation()]
})

export class newContactComponent extends AppComponentBase implements OnInit,AfterViewInit {

  private value:any = {};
  private _disabledV:string = '0';
  disabled:boolean = false;
  initData:number=0;
  addinitData:number=0;
  values_arr:any=[];
  contact_arr:any=[];
  
  contact_edit: CreateCompanyOrContact = new CreateCompanyOrContact();
  address:CreateAddressInfo =new CreateAddressInfo();
  contact:CreateContactInfo = new CreateContactInfo();
  removed_address_arr:any=[];
  remove_contact_arr:any=[];
  companytypes:Array<any> = [];
  companyType:Datadto[]=[];
  types:Datadto[];
  active_company:SelectOption[];
  active_customer:SelectOption[];
  active_title:SelectOption[];
   public myForm: FormGroup;
   cusTypeId:number=0;
   cmpname:string='';
   lname:string='';
   formdata:any=[];
   dataCon: any=[];
   contact_remove_values:any=[];
   address_remove_values:any=[];
   items:Array<any> = [];
   title:Array<any> = [];
   new_company_id:number=0;
   new_title_id:number=0;
   id:number=0;
   enq_id:number=0;
   cmp_disabled:boolean=false;
   private indus:Array<any>=[];
   allIndustry:Datadto[];
   active_indus:SelectOption[];
   constructor(
        injector: Injector,
        private _http: Http,
        private _fb: FormBuilder,
        private _cfb: FormBuilder,
        private router: Router,
        private _activatedRoute: ActivatedRoute,
        private _select2Service: Select2ServiceProxy,
        private _newCompanyContactServiceProxy:CompanyContactServiceProxy ,
        private cdr: ChangeDetectorRef 
    )
    {
        super(injector); 
        this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];   //<----- + sign converts string value to number
            this.enq_id = +params['enqId'];
});
        //console.log(this.id);

    }
       show(){
        return this._fb.group({
            companyName: [this.cmpname, [Validators.required]],
			lastName: [this.lname, [Validators.required]],
            typeid: this.cusTypeId,
            newcompanyid: this.new_company_id,
			newtitleid: this.new_title_id,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([]),
           // empaddress:this._fb.array([])
        });
        
       } 
       ngOnInit() {
        this.contact_remove_values =[];
        this.address_remove_values=[];
        this.dataCon=[];
        this.formdata=[];
        this._newCompanyContactServiceProxy.getContactForEdit(this.id).subscribe((result)=>{
            //console.log(result[0]);
			
            if(result!=null){
              this.formdata=result[0].addressInfo;
              this.dataCon = result[0].contactinfo;
			  //console.log(this.dataCon[0].infoData);
              this.cmpname = result[0].name;
              this.cusTypeId = result[0].newCustomerTypeId;
              this.new_company_id = result[0].companyId;
			        this.new_title_id = result[0].titleId;
			        this.lname = result[0].lastName;
              
            // add address
            
            this._select2Service.getContactType().subscribe((result) => {
           if (result.select2data != null) {
            this.companyType=result.select2data;
            this.companytypes=[];
            this.companyType.forEach((customer:{id:number,name:string})=>{
              this.companytypes.push({
                id:customer.id,
                text:customer.name
              });
              if(this.cusTypeId===customer.id){
                   this.active_customer = [{id:customer.id,text:customer.name}];
                }
            });
            
           } });

            this._select2Service.getCompany().subscribe((result) => {
           if (result.select2data != null) {
            this.types = result.select2data;
            this.items=[];
              this.types.forEach((company:{id:number, name:string}) => {
              this.items.push({
              id: company.id,
              text: company.name
              });
              if(this.new_company_id==company.id){
                this.active_company=[{id:company.id,text:company.name}];
                this.cmp_disabled = true;
              }
             });
            }
            
        });
		this._select2Service.getTitle().subscribe((result) => {
            if (result.select2data != null) {
              this.types = result.select2data;
              this.title=[];
                this.types.forEach((titles:{id:number, name:string}) => {
                  this.title.push({
                    id: titles.id,
                    text: titles.name
                  });
				if(this.new_title_id == titles.id){
                  this.active_title=[{id:titles.id,text:titles.name}];
                }
                });
            } 
		});

            this.myForm = this.show();

            this.addAddress(0);
            // // add contact
            this.addContacts(0);

            
          }

        });
        
        
        
        
        this.myForm = this._fb.group({
            companyName: [this.cmpname, [Validators.required]],
			lastName: [this.lname, [Validators.required]],
            typeid: this.cusTypeId,
            newcompanyid: this.new_company_id,
			newtitleid: this.new_title_id,
            addresses: this._fb.array([]),
            contacts: this._cfb.array([]),
           // empaddress:this._fb.array([])
        });
      //console.log(this.cmpname,this.lname);


    }
    ngAfterViewInit(): void {

    }

 // Contact
  initContact(){
         return this._cfb.group({
            id:0,
            contactinfo: [''],
            infoid: null
        });
    }

    addContacts(data) {
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
        this.remove_contact_arr.push(data._value);
        this.contact_remove_values.push(data._value);
        
        control.removeAt(i);
    }

// Address
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
            this.formdata.forEach((country:{id:number,address1:string, address2:string,infoTypeId:number,contacId:number}) =>{
            control.push(this._fb.group({
            id: country.id,  
            street: [country.address1, Validators.required],
            postcode: [country.address2],
            typeid: country.infoTypeId,
            company:country.contacId
        }))
            });

         return 1;
        }
        control.push(addrCtrl);
    }
    removeAddress(i: number,data:any) {
        const control = <FormArray>this.myForm.controls['addresses'];
        this.removed_address_arr.push(data._value);
        this.address_remove_values.push(data._value);
        
        //console.log(this.address_remove_values.id);

        control.removeAt(i);
    }

  public selected(value:any):void {
    //console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    
    //console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
   // console.log('New search input: ', value);
  }

  public refreshValue(value:any,model):void {
    //console.log(value);
    model.value.typeid = value.id;
  }
  public refreshCompany(value:any,model):void{
    //console.log(value);
    model.value.newcompanyid = value.id;
  }
  public removedCompany(value,model):void{
    //console.log(value);
    model.value.newcompanyid = 0;
  }
  public refreshTitle(value:any,model):void{
   // console.log(value);
    model.value.newtitleid = value.id;
  }
  public removedTitle(value,model):void{
    //console.log(value);
    model.value.newtitleid = 0;
  }
  goToCompany(){
    var the_url = window.location.pathname;
        var the_arr = the_url.split('/');
        the_arr.pop();
        var from_location = the_arr[3];
        //console.log(from_location);
    if(this.enq_id>0 && from_location=='contact'){
      this.router.navigate(['app/main/kanban',this.enq_id,]);
    }else if(this.enq_id>0 && from_location=='company'){
    this.router.navigate(['app/main/company',this.enq_id,0]);
  }else{
    this.router.navigate(['app/main/contact']);
  }

  }
// Save
    save(model) {
      this.values_arr=[];
      this.contact_arr=[];
        for(var i=0;i<model.value.addresses.length;i++){
            if(model.value.addresses[i].id==0 || model.value.addresses[i].street!=this.formdata[i].address1 || model.value.addresses[i].postcode!=this.formdata[i].address2 || 
               model.value.addresses[i].typeid!=this.formdata[i].infoTypeId){
              this.values_arr.push(model.value.addresses[i]);
              this.address.id = model.value.addresses[i].id;
              this.address.contacId = model.value.addresses[i].company;
              this.address.infoTypeId = model.value.addresses[i].typeid;
              this.address.address1 = model.value.addresses[i].street;
              this.address.address2 = model.value.addresses[i].postcode;
              //console.log(this.address);
              this._newCompanyContactServiceProxy.createOrUpdateAddressInfo(this.address).subscribe((result)=>{
              this.ngOnInit();

              });
            }
            
        }
        for(var i=0;i<model.value.contacts.length;i++){
            if(model.value.contacts[i].id==0 || model.value.contacts[i].contactinfo!=this.dataCon[i].infoData || model.value.contacts[i].infoid!=this.dataCon[i].newInfoTypeId ){
              this.contact_arr.push(model.value.contacts[i]);
              this.contact.id =model.value.contacts[i].id;
              this.contact.contacId = this.id;
              this.contact.infoTypeId = model.value.contacts[i].infoid;
              this.contact.infoData = model.value.contacts[i].contactinfo;
			  //console.log(this.contact.infoData);
              this._newCompanyContactServiceProxy.createOrUpdateContactInfo(this.contact).subscribe((result)=>{
                  //console.log(result);
                  this.ngOnInit();
              });
            }
        }
        this.contact_edit.customerTypeId= model.value.typeid;
        this.contact_edit.companyId=model.value.newcompanyid;
		this.contact_edit.titleId=model.value.newtitleid;
        this.contact_edit.id = this.id;
        this.contact_edit.name = model._value.companyName;
		this.contact_edit.lastName = model._value.lastName;
        //console.log(this.contact_edit);
       /* this._newCompanyContactServiceProxy.createOrUpdateCompanyOrContact(this.contact_edit).subscribe((result) => {
                
                console.log(result);
            });*/
        if(this.contact_remove_values.length>=1){
          this.contact_remove_values.forEach((con:{id:number})=>{
            this._newCompanyContactServiceProxy.getDeleteContactInfo(con.id).subscribe((result)=>{
         this.ngOnInit();
        });
          });
        }
        if(this.address_remove_values.length>=1){
          this.address_remove_values.forEach((add:{id:number})=>{
              this._newCompanyContactServiceProxy.getDeleteAddressInfo(add.id).subscribe((result)=>{
         this.ngOnInit();
        });
          });
        }
         var the_url = window.location.pathname;
        var the_arr = the_url.split('/');
        the_arr.pop();
        var from_location = the_arr[3];
        //console.log(from_location);
        if(this.enq_id>0 && from_location=='contact'){
            this.router.navigate(['app/main/kanban',this.enq_id,]);
        }else if(this.enq_id>0 && from_location=='company'){
            this.router.navigate(['app/main/company',this.enq_id,0]);
        }else{
            
        }
        this.ngOnInit();
        this.notify.success(this.l('Saved Successfully'));
        

    }
}
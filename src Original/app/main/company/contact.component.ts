import { Component, Input,OnInit,Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponentBase } from "shared/common/app-component-base";
import { Http } from "@angular/http";
import { Select2ServiceProxy,Datadto } from "shared/service-proxies/service-proxies";


export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    moduleId: module.id,
    selector: 'contact',
    styleUrls: ['./custom.component.css'],
    templateUrl: 'contact.component.html',
})

export class ContactCompComponent extends AppComponentBase implements OnInit{
    @Input('group')
    public contactForm: FormGroup;
    contacttypes:Array<any> = [];
    contactType:Datadto[]=[];
    active_con:SelectOption[];
	test:string='';
	//contactinfoo:any;
	//contactIn:string='';
    enableEmail:boolean=false;
	enablePhone:boolean=true;
    constructor(
        injector: Injector,
        private _select2Service: Select2ServiceProxy
        
    ){
        super(injector);
        //console.log(this.companys);
    }
    ngOnInit() {
       //console.log(this.contactForm.value.contactinfo);
    	this._select2Service.getContactInfo().subscribe((result) => {

			//console.log(result,'contactinfo');
           if (result.select2data != null) {
           	this.contactType=[];
           	this.contacttypes=[];
            this.contactType=result.select2data;
            this.contactType.forEach((company:{id:number,name:string})=>{
            	this.contacttypes.push({
            		id:company.id,
            		text:company.name
            	});
            	if(this.contactForm.value.infoid==company.id){
            		this.active_con=[{id:this.contactForm.value.infoid,text:company.name}];

					/*this.contactIn=this.contactForm.value.contactinfo;
					
					this.contactForm.value.contactinfo=company.name;
					console.log(this.contactForm.value.contactinfo,33);
				 	if(this.contactForm.value.contactinfo=='Email'){
						console.log('email');
					}
					else{console.log('not email');
							} */
					
            	}

            });

           } }); 

   
		   
		  
	}
	
	
	
	selectType(value:any){
		
		//this.contactinfoo=this.contactForm.value.contactinfo;
        this.contactForm.value.contactinfo=value.text;
		//console.log(value,this.contactForm.value.contactinfo);
		
    }

	public refreshContactValue(value:any,model):void {
    		model.controls.infoid.setValue(value.id);
			model.controls.contactinfo.setValue(value.text);
    		//console.log(model.controls.infoid.value,value.id);
  }
  
  doSomethingchange(data){

	  let ind =  this.contacttypes.findIndex(
			  y => y.id ===  this.contactForm.value.infoid);


	  if(this.contacttypes[ind].text =='Email'){
		  this.enablePhone=true;
		  var reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

		  if (reg.test(data)){
		  	this.enableEmail=false;
		  }
		  else
	         this.enableEmail=true;

		 
	  }
	  if(this.contacttypes[ind].text=='Phone'){

		 this.enableEmail=false;
		 var reg =/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		 if (reg.test(data)){
		  	this.enablePhone=true;
		 }
		 else
	      this.enablePhone=false;

		 }
	
	}
} 
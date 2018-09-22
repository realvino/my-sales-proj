import { Component, Input,OnInit, Injector} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponentBase } from "shared/common/app-component-base";
import { Http } from "@angular/http";
import { Select2ServiceProxy,Datadto,EnquiryServiceProxy } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from '@angular/router';

export interface SelectOption{
   id?: number;
   text?: string;
}

@Component({
    moduleId: module.id,
    selector: 'address_con',
    styleUrls: ['./custom.component.css'],
    templateUrl: 'address.component.html',
})
export class ContactAddressNewComponent extends AppComponentBase implements OnInit{
  @Input('group')
  public adressForm: FormGroup;
  private companytypes:Array<any> = [];
  companyType:Datadto[]=[];
  active_company:SelectOption[];
  LocText:string = null;
  id:number;
  private sub:any;
  displayOption:boolean=false;
 	constructor(
        injector: Injector,
        private _select2Service: Select2ServiceProxy,
        private _inquiryServiceProxy: EnquiryServiceProxy,
        private router:Router,
        private _activatedRoute:ActivatedRoute
        
    ){
        super(injector);
        //console.log(this.companys);

    }
    ngOnInit() {
      this.sub = this._activatedRoute.params.subscribe(params => {
       this.id = +params['id']; // (+) converts string 'id' to a number
       
    });
      // console.log(this.router.url,' address form url');
      if(this.router.url=='/app/main/kanban' || this.router.url=='/app/main/kanban/'+this.id){
          this.displayOption=true;
      }else{
          this.displayOption=false;
      }
    	this._select2Service.getAddressInfo().subscribe((result) => {
           if (result.select2data != null) {
           	this.companytypes=[];
            this.companyType=result.select2data;
            this.companyType.forEach((company:{id:number,name:string})=>{
            	this.companytypes.push({
            		id:company.id,
            		text:company.name
            	});
            	if(this.adressForm.value.typeid==company.id){
            		this.active_company=[{id:company.id, text:company.name}];
            	}
            	
            });

           } });
    } 
    public refreshValue(value:any,model):void {
    model.controls.typeid.setValue(value.id);
    //console.log(model.controls.typeid.value,value.id);
  }
}
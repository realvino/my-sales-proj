import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router,ActivatedRoute,NavigationEnd } from "@angular/router";
import { CreateActivityInput,EnquiryInput, ActivityServiceProxy,Select2ServiceProxy } from "shared/service-proxies/service-proxies";
import * as moment from "moment";

export interface SelectOption {
    id?: number;
    text?: string;
}

@Component({
    selector: 'createEActivityModal',
    templateUrl: './createActivity.component.html',
    styleUrls : ['./createEnquiry.component.css']
})

export class CreateActivityComponent extends AppComponentBase {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    activity: CreateActivityInput = new CreateActivityInput()// eventOriginal = this.activity;
    active = false;
    saving = false;

    public contactlist: Array<any>=[];
    public contact:Array<any> =[];
    public activitytypes: Array<any>=[];
    public activitytypo: Array<any>=[];
    public enqId:number;
    private sub: any;
    public enquiry:EnquiryInput=new EnquiryInput();
    active_type:SelectOption[];
    active_contact:SelectOption[];
    public sc_date:Date;

    constructor(
        injector: Injector,
        private _activityService: ActivityServiceProxy,
        private _selectProxy:Select2ServiceProxy,
        private router: Router,
        private _activatedRoute: ActivatedRoute

    ) {
        super(injector);
    }

    ngOnInit(){
        this.sub = this._activatedRoute.params.subscribe(params => {
            this.enqId = +params['id']; // (+) converts string 'id' to a number

        });

        //console.log(abp.multiTenancy.getTenantIdCookie());
    }
    show(enquiry?: any,actId?:any): void {

        this.enquiry = enquiry;
        this._activityService.getActivityForEdit(actId).subscribe((result) => {
             if (result.activitys != null) {
                this.activity=result.activitys;
                 this.sc_date =moment(result.activitys.scheduleTime).toDate();
             }
         });
        this.getType();
        this.getCompanyContact();
        this.active = true;
        this.modal.show();
    }


    save(event:any): void {

        this.saving = true;
        if (this.activity.id == null) {
            this.activity.id = 0;
        }
        this.activity.tenantId=abp.multiTenancy.getTenantIdCookie();
        this.activity.enquiryId= this.enquiry.id;
        this.activity.scheduleTime=moment(this.sc_date).add(6, 'hours');
        this._activityService.createOrUpdateActivity(this.activity)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(1);
                this.activity.activityTypeId=null;
                this.activity.contactId=null;
                this.activity.description='';
                this.activity.status=false;
                this.activity.title='';
                this.sc_date=null;

            });

    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.activity.activityTypeId=null;
        this.activity.contactId=null;
        this.activity.description='';
        this.activity.status=false;
        this.activity.title='';
        this.sc_date=null;
        this.active = false;
    }

    getType():void{

        this._selectProxy.getActivityType().
            subscribe((result)=>{
                //console.log(result,34);
                if(result.select2data != null){

                    this.activitytypes=result.select2data;
                    this.activitytypo = [];
                    this.activitytypes.forEach((type:{id:number, name:string}) => {
                        this.activitytypo.push({
                            id: type.id,
                            text: type.name
                        });
                        if(this.activity.activityTypeId==type.id){
                            this.active_type=[{id:type.id,text:type.name}];
                        }
                    });

                }
            });
    }


    getCompanyContact():void{
        this._selectProxy.getCompanyContact(this.enquiry.companyId).
            subscribe((result)=>{

                if(result.select2data != null){

                    this.contactlist=result.select2data;
                    this.contact = [];
                    this.contactlist.forEach((type:{id:number, name:string}) => {
                        this.contact.push({
                            id: type.id,
                            text: type.name
                        });
                        if(this.activity.contactId==type.id){
                            this.active_contact=[{id:type.id,text:type.name}];
                        }
                    });

                }
            });
    }

    doSomething(data): void {
        this.activity.activityTypeId = data.id;

    }
    removeType(data?:any){

        this.activity.activityTypeId=null;


    }

    selectContact(data): void {
        this.activity.contactId = data.id;
    }
    removeContact(data?:any){
        this.activity.contactId = null;
    }




}

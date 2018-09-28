import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import {CalendarModule} from 'primeng/primeng';
// import { CompanyContactServiceProxy,CreateCompanyOrContact } from '@shared/service-proxies/service-proxies';
import { Select2ServiceProxy,EnquiryInput,EnquiryServiceProxy } from "shared/service-proxies/service-proxies";

import * as moment from "moment";

export interface SelectOption {
    id?: number;
    text?: string;
}


@Component({
    selector: 'createEnquiryModal',
    templateUrl: './createEnquiry.component.html',
    styleUrls: ['./createEnquiry.component.css'],
})
export class CreateEnquiryComponent extends AppComponentBase  {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('nameInput') nameInput: ElementRef;
    public bsValue:any;
    active = false;
    saving = false;
    public contactlist: Array<any>=[];
    public contact:Array<any> =[];
    public companytypes: Array<any>=[];
    public companytypo: Array<any>=[];
    public milestones: Array<any>=[];
    public milestone: Array<any>=[];
    public statuslist: Array<any>=[];
    public status: Array<any>=[];
    active_contact:SelectOption[];
    active_milestonestatus:SelectOption[];
    tenantId:number;
    enquiry:EnquiryInput = new EnquiryInput();
    closedDate:string;


    constructor(
        injector: Injector,
        private _selectProxyService: Select2ServiceProxy,
        private _EnquiryServiceProxy:EnquiryServiceProxy
    ) {
        super(injector);
        this.tenantId = abp.multiTenancy.getTenantIdCookie();
    }

    show(): void {


        this.getCompany();
        this.getMilestone();
        this.getCompanyContact();
        this.getStatusbyMilestone();
        this.active= true;
        this.modal.show();


    }



    save(): void {
        this.saving = false;
        this.close();

        if (this.enquiry.id == null) {
            this.enquiry.id = 0;
        }
        if(this.closedDate){
            let stdate= moment(moment(this.closedDate).toDate().toString());
            this.enquiry.closeDate = moment(stdate).add(6, 'hours');
        }
        this.enquiry.tenantId=this.tenantId;
        this.enquiry.enquiryNo = "null";
        //console.log(this.enquiry);
        this._EnquiryServiceProxy.createOrUpdateEnquiry(this.enquiry).
            finally(() => this.saving = false)
            .subscribe(() => {
                        this.notify.info(this.l('SavedSuccessfully'));
                        this.close();
                        this.modalSave.emit(this.enquiry);
        });

    }
    onShown(): void {
        //$(this.nameInput.nativeElement).focus();
    }
    close(): void {
        this.modal.hide();
        this.active = false;
    }


    doSomething(data): void {
        this.enquiry.companyId = data.id;
        this.getCompanyContact();
    }
    removeType(data?:any){
        this.enquiry.companyId=null;
        this.enquiry.contactId=null;
        this.active_contact=[];
        this.contact = [];
    }

    selectContact(data): void {
        //console.log(data.id,'contact id');
        this.enquiry.contactId = data.id;
    }
    removeContact(data?:any){
        this.enquiry.contactId = null;
    }

    selectMilestone(data): void {
        this.enquiry.mileStoneId = data.id;
        this.getStatusbyMilestone();
    }
    removeMilestone(data?:any){
        // this.infotype.countryId = null;
        this.enquiry.mileStoneId = null;
    }
    selectStatus(data): void {
        this.enquiry.mileStoneStatusId = data.id;

    }
    removeStatus(data?:any){
        this.enquiry.mileStoneStatusId =null;
    }
    getCompany():void{
        this._selectProxyService.getCompany().
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

    }

    getMilestone():void{

        this._selectProxyService.getEnqMilestone().
            subscribe((result)=>{
                if(result.select2data != null){
                    this.milestones=result.select2data;
                    this.milestone = [];
                    this.milestones.forEach((company:{id:number, name:string}) => {
                        this.milestone.push({
                            id: company.id,
                            text: company.name
                        });
                    });

                }
            });
    }

    getCompanyContact():void{
        this._selectProxyService.getCompanyContact(this.enquiry.companyId).
            subscribe((result)=>{

                if(result.select2data != null){

                    this.contactlist=result.select2data;
                    this.contact = [];
                    this.contactlist.forEach((company:{id:number, name:string}) => {
                        this.contact.push({
                            id: company.id,
                            text: company.name
                        });
                    });

                }
            });
    }


    getStatusbyMilestone():void{
        //console.log('mile',this.enquiry.mileStoneId);
        this._selectProxyService.getMileStoneMileStatus(this.enquiry.mileStoneId).
            subscribe((result)=>{

                if(result.select2data != null){

                    this.statuslist=result.select2data;
                    this.status = [];
                    this.statuslist.forEach((company:{id:number, name:string}) => {
                        this.status.push({
                            id: company.id,
                            text: company.name
                        });
                    });
                }
            });
    }

    refreshCompany(value):void{

        //console.log(value,78);
        this.enquiry.companyId=value.id;
        this.enquiry.contactId=null;
        this.active_contact=[];
        this.getCompanyContact();

    }

    refreshMile(value):void{

       // console.log(value,78);
        this.enquiry.mileStoneId=value.id;
        this.enquiry.mileStoneStatusId=null;
        this.active_milestonestatus=[];
        this.getStatusbyMilestone();

    }


}
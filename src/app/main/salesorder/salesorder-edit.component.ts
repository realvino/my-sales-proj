import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IAjaxResponse } from '@abp/abpHttp';
import { TokenService } from '@abp/auth/token.service';
import { AppConsts } from '@shared/AppConsts';
import { Router,ActivatedRoute,NavigationEnd } from "@angular/router";
import { QuotationServiceProxy, PaymentScheduleLists, PaymentCollectionLists } from '@shared/service-proxies/service-proxies';
import { CreatePaymentCollectionComponent } from '@app/main/salesorder/create-or-edit-paymentCollection.component';
import { CreatePaymentScheduleComponent } from '@app/main/salesorder/create-or-edit-paymentSchedule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({

    templateUrl: './salesorder_edit.component.html',
    animations: [appModuleAnimation()]
})
export class SalesOrderEditComponent extends AppComponentBase {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('createPaymentScheduleModal') createPaymentScheduleModal: CreatePaymentScheduleComponent;
    @ViewChild('createPaymentCollectionModal') createPaymentCollectionModal: CreatePaymentCollectionComponent;
    quotation_id : number;
    type_preview:number;
    download_url:any;
    head_preview:string;
    active = false;
    saving = false;
    private sub: any;
    private id: number;
    private static_number : number;
    paymentScheduleList :PaymentScheduleLists[] = [];
    paymentCollectionList :PaymentCollectionLists[] = [];
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        private _tokenService: TokenService,
        private _activatedRoute: ActivatedRoute,
        private route:Router,
        private _quotationService : QuotationServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    ngOnInit(){

        this.sub = this._activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            this.static_number = +params['static_number'];
            this.getPreview(this.id,this.static_number);
        });
        this.getPaySchedule();
        this.getPayCollection();
    }

    getPreview(quotationId?: number,type?:number): void {
        this.quotation_id = quotationId;
        this.type_preview = type;
        if(quotationId){
            var xmlhttp = new XMLHttpRequest();
            var data="";
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                    if (xmlhttp.status == 200) {
                        if(typeof xmlhttp.response!=="undefined"){
                            //console.log(xmlhttp.response);
                            data = xmlhttp.response;
                            myGetData(JSON.parse(xmlhttp.response));
                        }
                    }
                    else if (xmlhttp.status == 400) {
                       // alert('There was an error 400');
                    }
                    else {
                        //alert('something else other than 200 was returned');
                    }

                }
            };
            var myGetData = function(arr){
                document.getElementById("myDiv").innerHTML = arr.result;
            }
            switch(this.type_preview){
                case 1:
                    var url = AppConsts.remoteServiceBaseUrl + "Pdf/ExportQuotationGenerate?QuotationId="+quotationId;
                    this.download_url = AppConsts.remoteServiceBaseUrl +'Pdf/ExportQuotationDownload?QuotationId='+this.quotation_id;
                    this.head_preview = 'Standard';
                    // alert(url);
                    // var url = "http://192.168.1.50:22745/pdf/ExportQuotationGenerate?QuotationId="+quotationId;
                    // this.download_url = "http://192.168.1.50:22745/pdf/ExportQuotationGenerate?QuotationId="+this.quotation_id;
                    // this.head_preview = 'Standard';
                    break;

                default:
                    break;


            }
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    }
    onShown(): void {

    }
    close(): void {

        this.route.navigate(['app/main/salesorder']);

        this.quotation_id = 0;
        //this.modal.hide();
        document.getElementById("myDiv").innerHTML = "";
        this.active = false;

    }
    download(){
        window.location.assign(this.download_url);
    }
    getPaySchedule(): void{
        //console.log(this.id);
        this._quotationService.getPaymentSchedule(this.id).subscribe((result) => {
            this.paymentScheduleList = result.items;
        });
    }
    createPaymentSchedule(): void{
        this.createPaymentScheduleModal.show(0,this.id);
    }
    editPaymentSchedule(data):void{
        this.createPaymentScheduleModal.show(data.id,this.id);
    }
    deletePaymentSchedule(data):void{
        this.message.confirm(
            this.l('Are you sure to Delete the Payment Schedule'),
            isConfirmed => {
                if (isConfirmed) {
                  this._quotationService.deletePaymentSchedule(data.id).subscribe(() => {
                        this.notify.success(this.l('Successfully Deleted'));
                        this.getPaySchedule();
                    });
                  
                }
            }
        );
    }
    
    getPayCollection():void{
        this._quotationService.getPaymentCollection(this.id).subscribe((result) => {
            this.paymentCollectionList = result.items;
        });
    }
    createPayCollection(): void{
        this.createPaymentCollectionModal.show(0,this.id);
    }
    editPayCollection(data):void{
        this.createPaymentCollectionModal.show(data.id,this.id);
    }
    deletePayCollection(data):void{
        if(!data.received){
            this.message.confirm(
                this.l('Are you sure to Delete the Payment Collection'),
                isConfirmed => {
                    if (isConfirmed) {
                      this._quotationService.deletePaymentCollection(data.id).subscribe(() => {
                            this.notify.success(this.l('Successfully Deleted'));
                            this.getPayCollection();
                        });
                      
                    }
                }
            );

        }
        else{
            this.notify.warn(this.l('Cannot Delete The Payment Collection'));
        }
        
    }
}

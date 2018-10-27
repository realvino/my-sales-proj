import { Component, ViewChild, Injector, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IAjaxResponse } from '@abp/abpHttp';
import { TokenService } from '@abp/auth/token.service';
import { AppConsts } from '@shared/AppConsts';
// import { HttpClient } from './http-client';

@Component({
    selector: 'quotationPreviewModal',
    templateUrl: './quotation-preview.component.html'
})
export class QuotationPreviewModalComponent extends AppComponentBase {
 
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modal') modal: ModalDirective;
    quotation_id : number;
    type_preview:number;
    download_url:any;
    head_preview:string;
    active = false;
    saving = false;
    constructor(
        injector: Injector,
        // private _quotationService: QuotationServiceProxy,
        private _tokenService: TokenService
        // private http: HttpClient
    ) {
        super(injector);
    }
   show(quotationId?: number,type?:number): void {
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
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
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
        this.active = true;
        this.modal.show();
    }
    onShown(): void {
        
    }
    close(): void {

        this.quotation_id = 0;
        this.modal.hide();
        document.getElementById("myDiv").innerHTML = "";
        this.active = false;

    }
    download(){
        window.location.assign(this.download_url);
    }
}

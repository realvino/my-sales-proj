import { Component, OnInit, Injector,ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { EnquiryServiceProxy,EnquiryList } from "shared/service-proxies/service-proxies";
import * as moment from "moment";

@Component({
  selector:'closedDealModal', 	
  templateUrl: './closed-deal-notification.component.html',
  styleUrls: ['./closed-deal-notification.component.css']
})
export class ClosedDealNotificationComponent extends AppComponentBase implements OnInit {
  
  @ViewChild('modal') modal: ModalDirective; 
  missedLeads:EnquiryList[];
  filter:string;	
  constructor(
  	private injector:Injector,
    private _enquiryService:EnquiryServiceProxy
  ) { 
  	super(injector);
  }

	ngOnInit() {
	}
	show(): void {
          this.getMissedLead();
	        this.modal.show();

	}
  getMissedLead(){
    this._enquiryService.getNotificationEnquiry().subscribe(result=>{
          if(result.items!=null){
            this.missedLeads = result.items;
          }
    });
  }
	close(): void {
		    this.modal.hide();
	}

}

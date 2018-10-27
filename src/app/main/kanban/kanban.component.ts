import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation,OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
// import { ModalDirective } from 'ng2-bootstrap';
import { CreateEnquiryComponent } from "app/main/enquiry/createEnquiry.component";
import { Router,ActivatedRoute } from "@angular/router";
import { EnquiryServiceProxy,EnquiryKanbanUpdateInput, EnquiryQuotationKanbanUpdateInput } from "shared/service-proxies/service-proxies";
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs/Subject';
import { AppConsts } from '@shared/AppConsts';
import { QuotationCloseComponent } from './quotationClose.component';

@Component({

    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
    })

export class KanbanComponent extends AppComponentBase implements AfterViewInit,OnDestroy {

  @ViewChild('createEnquiryModal') createEnquiryModal: CreateEnquiryComponent;
  @ViewChild('quotationCloseModal') quotationCloseModal: QuotationCloseComponent;
  filter:string='';
  public items: Array<any> = [];
  public qitems: Array<any> = [];
  enq_upadte_input:EnquiryKanbanUpdateInput = new EnquiryKanbanUpdateInput();
  qot_upadte_input:EnquiryQuotationKanbanUpdateInput = new EnquiryQuotationKanbanUpdateInput();
  currantflag: any;
  updatedflag: any;
  path : string = AppConsts.remoteServiceBaseUrl;
  private destroy$ = new Subject();	
  currentIsEndQuotation:any;
  updateIsEndQuotation: any;
constructor(
  injector: Injector,
  private dragulaService: DragulaService,
  private router:Router,
  private _enquiryService:EnquiryServiceProxy){
  super(injector);
  // dragulaService.setOptions("COLUMNS", {
  //     direction: 'horizontal',
  //     moves: (el, source, handle) => handle.className === "group-handle"
  //   });
  
  // dragulaService.setOptions('main-bag', {
  //   isContainer: function(el) {
  //     return false;
  //   },
  //   moves: function(el, container, handle) {
  //     return true;//handle.classList.contains('master');
  //   },
  //   accepts: function(el, target, source, sibling) {
     
  //   },
  //   invalid: function (el, handle) {
  //     return false; // don't prevent any drags from initiating by default
  //   },
  //   direction: 'horizontal',             // Y axis is considered when determining where an element would be dropped
  //   copy: function(el,source) {
     
  //   },                       // elements are moved by default, not copied
  //   copySortSource: false,             // elements in copy-source containers can be reordered
  //   revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
  //   removeOnSpill: true,              // spilling will `.remove` the element, if this is true
  //   mirrorContainer: document.body,    // set the element that gets mirror elements appended
  //   ignoreInputTextSelection: true     // allows users to select input text, see details below
  
  // });
	dragulaService.setOptions('main-bag', {
      removeOnSpill: true
    });
    dragulaService.drag.subscribe((value) => {
      //console.log(`drag: ${value[0]}`);
      //this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      //console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1),value.slice(2),value.slice(3));
    });
    dragulaService.over.subscribe((value) => {
      //console.log(`over: ${value[0]}`);
      //this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      //console.log(`out: ${value[0]}`);
      //this.onOut(value.slice(1));
    });
}
ngAfterViewInit(){
	this.getEnquiryTic();
}
getEnquiryTic(){
  this._enquiryService.getInquiryKanban(this.filter).subscribe((result)=>{
      this.items = result;
      //console.log(this.items);
  });
  //  this._enquiryService.getEnquiryQuotationsKanban(this.filter).subscribe((result)=>{
  //     this.qitems = result;
  //     console.log(result,'quot enq kanban');
  // }); 
}
  private onDrop(itemArg, updatedArg, currentArg) {
    let [ei, eli] = itemArg;
    let [eu, elu] = updatedArg;
    let [ec, elc] = currentArg;

    this.enq_upadte_input.enquiryId = ei.getAttribute("data-itemId");
    this.enq_upadte_input.currentMilestone = ec.getAttribute("data-milestoneId");
    this.enq_upadte_input.updateMilestone = eu.getAttribute("data-milestoneId");

    this.qot_upadte_input.quotationId = ei.getAttribute("data-quotationId");
    this.qot_upadte_input.currentMilestone = ec.getAttribute("data-milestoneId");
    this.qot_upadte_input.updateMilestone = eu.getAttribute("data-milestoneId");

    this.currantflag = ec.getAttribute("data-isquotation");
    this.updatedflag = eu.getAttribute("data-isquotation");

    this.currentIsEndQuotation = ec.getAttribute('data-endQuotation');
    this.updateIsEndQuotation = eu.getAttribute('data-endQuotation');

    if(this.currantflag == this.updatedflag){
      if(this.currantflag == 'false'){
        this._enquiryService.enquiryKanbanUpdateAsync(this.enq_upadte_input).subscribe(result=>{
          this.notify.success("Enquiry Moved Successfully");
          this.getEnquiryTic();
      });
      } else{
          if(this.updateIsEndQuotation == 'true'){
            this.quotationCloseModal.show(this.qot_upadte_input.quotationId, this.qot_upadte_input.currentMilestone, this.qot_upadte_input.updateMilestone);
          } 
          else if(this.currentIsEndQuotation == 'true'){
            this.quotationCloseModal.show(this.qot_upadte_input.quotationId, this.qot_upadte_input.currentMilestone, this.qot_upadte_input.updateMilestone);
            /* this.notify.error("Quotation cannot be moved");
            this.getEnquiryTic(); */
          }
          else{
            this._enquiryService.enquiryQuotationKanbanUpdateAsync(this.qot_upadte_input).subscribe(result=>{
              this.notify.success("Quotation Moved Successfully");
              this.getEnquiryTic();
            }); 
          }
      } 
    }
    else{
      this.notify.error("Card can not moved");
      this.getEnquiryTic();
    } 
  }
  createEnquiry(){
    this.createEnquiryModal.show();
  }
  editLeads(data?:any){
      this.router.navigate(['/app/main/leads/',data.id]);
  }
  editQuotation(data?:any){
     if(data.quotationId >0){
         this.router.navigate(['/app/main/quotation/editquotation//',data.quotationId]);
     }else{
         this.router.navigate(['/app/main/leads/',data.id]);
     }
  }
  ngOnDestroy() {
    this.destroy$.next();		
  	this.dragulaService.destroy('main-bag');
  }
}    
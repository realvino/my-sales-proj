import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation,OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DragulaService } from 'ng2-dragula';
import { ModalDirective } from 'ng2-bootstrap';
// import { CreateEnquiryComponent } from "app/main/enquiry/createEnquiry.component";
import { Router,ActivatedRoute } from "@angular/router";

@Component({

    templateUrl: './monthly-view.component.html',
    styleUrls: ['./monthly-view.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
    })

export class MonthlyViewComponent extends AppComponentBase implements AfterViewInit,OnDestroy {

  // @ViewChild('createEnquiryModal') createEnquiryModal: CreateEnquiryComponent;
constructor(injector: Injector,private dragulaService: DragulaService,private router:Router)
{
	super(injector);
	dragulaService.setOptions('nested-bag', {
      removeOnSpill: true
    });
    dragulaService.drag.subscribe((value) => {
      //console.log(`drag: ${value[0]}`);
      //this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
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
	
}
// getEnquiryTic(){
//   alert('ok');
// }
private onDrop(args) {
    let [e, el] = args;
    //console.log(e,el);
  }
  /*createEnquiry(){
    this.createEnquiryModal.show();
  }
  editLeads(number?:any){
    this.router.navigate(['/app/main/leads/',number]);
  }*/
  ngOnDestroy() {
  	this.dragulaService.destroy('nested-bag');
  }
}    
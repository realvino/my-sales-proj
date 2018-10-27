import { Component, OnInit, ViewEncapsulation,ViewChild,Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditMileStoneModalComponent } from "app/main/mile-stone/create-edit-mileStone.component";
import {  MilestoneServiceProxy,MileStoneListDto } from "shared/service-proxies/service-proxies";
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-mile-stone',
  templateUrl: './mile-stone.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mile-stone.component.css'],
  animations: [appModuleAnimation()]
})
export class MileStoneComponent extends AppComponentBase {
  @ViewChild('createMileStoneModal') createMileStoneModal: CreateOrEditMileStoneModalComponent;	
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('paginator') paginator: Paginator; 
   filterText: string = '';
   mileStoneList: MileStoneListDto[] = [];
  
  constructor( private injector:Injector,
  private _activatedRoute: ActivatedRoute,
  private _mileStoneProxyService: MilestoneServiceProxy,
   private route:Router
  ) { 
  	super(injector);
  	// this.getMileStone();
	let d = abp.multiTenancy.getTenantIdCookie();
	//console.log(d);
	
  }

   ngAfterViewInit(): void {
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.getMileStone();
   }
  
    getMileStone(): void {
        this._mileStoneProxyService.getMilestones(this.filterText)
        .subscribe((result) => {
            //console.log(result);
             this.mileStoneList = result.items;
        });
    }
	
	editMilestone(data): void {

        //console.log(data);
		this.createMileStoneModal.show(data.id);
    }
	
	deleteMileStone(MilStone): void {
		//console.log(MilStone);
        this.message.confirm(
            this.l('Are you sure to Delete the Milestone' ,MilStone.name),
                isConfirmed => {
                if (isConfirmed) {
                    this._mileStoneProxyService.getDeleteMilestone(MilStone.id).subscribe(result=>{
                        if(result)
                        {
                            this.notify.error(this.l('This infotype has used, So could not delete'));
                        }else{
                            this.getMileStone();
                        }
                    });
                }
            }
        );
    }
  
  
  createMileStone(){
	
	this.createMileStoneModal.show();
  }

}

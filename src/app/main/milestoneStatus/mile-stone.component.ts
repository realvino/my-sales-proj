import { Component, OnInit, ViewEncapsulation,ViewChild,Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { CreateOrEditMileStoneStatusComponent } from "app/main/milestoneStatus/create-edit-mileStone.component";
import { MileStoneStatusServiceProxy,CreateMileStoneStatusInput, MileStoneStatusListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-mile-stone',
  templateUrl: './mile-stone.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mile-stone.component.css'],
  animations: [appModuleAnimation()]
})
export class MileStoneStatusComponent extends AppComponentBase {
  @ViewChild('createMileStoneStatus') createMileStoneStatus: CreateOrEditMileStoneStatusComponent;
  @ViewChild('dataTable') dataTable: DataTable;
  @ViewChild('paginator') paginator: Paginator;
  filter:string ='';
  mileStoneStatusList:MileStoneStatusListDto[]=[];
  constructor(   private injector:Injector, 
				 private _activatedRoute: ActivatedRoute,
				 private _mileStoneProxyService: MileStoneStatusServiceProxy,
				 private route:Router) {
					 
  	super(injector);
  	// this.getMileStone();
    abp.multiTenancy.getTenantIdCookie();
    }
		ngAfterViewInit(): void {
      this.filter = this._activatedRoute.snapshot.queryParams['filter'] || '';
      this.getMileStone();
		}
   getMileStone(){
      this._mileStoneProxyService.getMileStoneStatus(this.filter).
       subscribe(result => {
         this.mileStoneStatusList = result.items;
      });
  }
  deleteMileStone(data){
  	//console.log(data);

    this.message.confirm(
        this.l('Are you sure to Delete the MileStone Status', data.name),
            isConfirmed => {
          if (isConfirmed) {
            this._mileStoneProxyService.deleteMileStoneStatus(data.id).subscribe(result=>{
             this.getMileStone();
              this.notify.success(this.l("Deleted Successfully"));
            });
          }
        }
    );
  }
  createMileStoneStat(record){
  	this.createMileStoneStatus.show(record);
  }

}

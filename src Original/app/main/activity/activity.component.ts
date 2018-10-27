import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from "moment";
import { ActivityTypeListDto, ActivityTypeServiceProxy } from "shared/service-proxies/service-proxies";
import { CreateActivityModalComponent } from "app/main/activity/create-or-edit-activity.component";

@Component({
    templateUrl: './activity.component.html',
    styleUrls: ['./activity.component.less'],
    animations: [appModuleAnimation()]
})

export class ActivityTypeComponent extends AppComponentBase implements OnInit {

   @ViewChild('createActivityModal') createActivityModal: CreateActivityModalComponent;
   currentStep: number = 1;
   filter = '';
  
   activityTypes:ActivityTypeListDto[] =[];
   activites:any=[];
   constructor(
        injector: Injector,
         private _activityService: ActivityTypeServiceProxy
    )
    {
        super(injector);
    }

  ngOnInit(): void {
        this.getActivity();
    }
  createActivity(): void {
       this.createActivityModal.show(0);
    }

  editActivity(data): void {
       this.createActivityModal.show(data.id);
    }


  getActivity(): void {
   
    this._activityService.getActivityType(this.filter).subscribe((result) => {
		this.activityTypes = result.items;
		});
 }

 
deleteActivity(activity: ActivityTypeListDto): void {
    this.message.confirm(
        this.l('Are you sure to Delete the Activity Type', activity.code),
        isConfirmed => {
            if (isConfirmed) {
              this._activityService.getDeleteActivityType(activity.id).subscribe(() => {
                    this.notify.success(this.l('Successfully Deleted'));
                    _.remove(this.activityTypes, activity); 
                });
              
            }
        }
    );
  }

}
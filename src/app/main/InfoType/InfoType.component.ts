import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateOrEditNewInfoTypeComponent } from "app/main/InfoType/createEditNewInfoType.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import {InfoTypeServiceProxy,NewInfoTypeInputDto} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';




@Component({

    templateUrl: './InfoType.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]})

export class InfoTypeComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createNewInfoTypeModal') createNewInfoTypeModal: CreateOrEditNewInfoTypeComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';



   constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private _infotype:InfoTypeServiceProxy

    ) 
    {
        super(injector);

    }

    
        ngAfterViewInit(): void {

        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';

    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage(), null);
    }

    getData(event?: LazyLoadEvent): void {
        let data;
        this.primengDatatableHelper.showLoadingIndicator();
        if(this.primengDatatableHelper.getMaxResultCount(this.paginator, event)==0){
            data=10;
        }
        else{
            data=this.primengDatatableHelper.getMaxResultCount(this.paginator, event)
        }

        this._infotype.getNewInfoType(this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });

    }

    createInfoType():void{

        this.createNewInfoTypeModal.show(0);
    }


    deleteInfoType(infotype: NewInfoTypeInputDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the InfoType', infotype.contactName),
                isConfirmed => {
                if (isConfirmed) {
                    this._infotype.getDeleteNewInfoType(infotype.id).subscribe(result=>{
                        if(result)
                        {
							this.notify.error(this.l('This infotype has used, So could not delete'));
							 
                        }else{
							
							this.notify.info(this.l('SuccessfullyDeleted'));
                            this.getData();
                        }
                    });
                }
            }
        );
    }

    editinfoType(record):void{
        this.createNewInfoTypeModal.show(record.id);
    }


} 
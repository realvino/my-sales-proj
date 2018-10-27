import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateOrEditNewCustomerTypeComponent } from "app/main/newCustomerType/createEditNewCustomerType.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import {CustomerTypeServiceProxy,NewCustomerTypeInputDto} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';


@Component({

    templateUrl: './newCustomerType.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]})

export class NewCustomerTypeComponent extends AppComponentBase implements AfterViewInit {

   @ViewChild('createNewCustomerTypeModal') createNewCustomerTypeModal: CreateOrEditNewCustomerTypeComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';
    public items:Array<any> = [];



   constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private _customerTypeProxyService: CustomerTypeServiceProxy

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

  /*  getRoles(): void {
        this.primengDatatableHelper.showLoadingIndicator();
        this.primengDatatableHelper.records = this.items;
        this.primengDatatableHelper.totalRecordsCount = this.items.length;
        this.primengDatatableHelper.hideLoadingIndicator();

    }*/

    createCustomerType():void{

        this.createNewCustomerTypeModal.show(0);
    }


    getdata(event?: LazyLoadEvent):void{

        this.primengDatatableHelper.showLoadingIndicator();
        this._customerTypeProxyService.getNewCustomerType(this.filterText,
                                                            this.primengDatatableHelper.getSorting(this.dataTable),
                                                            10,
                                                            //this.primengDatatableHelper.getMaxResultCount(this.paginator, event),
                                                            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                //console.log(result,'Total Items');
                this.primengDatatableHelper.hideLoadingIndicator();
            });
    }


    deleteCustomerType(customertype: NewCustomerTypeInputDto): void {
        this.message.confirm(
            this.l('Are you sure to Delete the CustomerType', customertype.title),
                isConfirmed => {
                if (isConfirmed) {
                    this._customerTypeProxyService.getDeleteNewCustomerType(customertype.id).subscribe(result=>{
                        if(result)
                        {
                            this.notify.error(this.l('This customertype has used, So could not delete'));
                        }else{
							this.notify.info(this.l('Successfully Deleted'));
                            this.getdata();
                        }
                    });
                }
            });
    }


    editCustomerType(record):void{

        this.createNewCustomerTypeModal.show(record.id);
    }

} 
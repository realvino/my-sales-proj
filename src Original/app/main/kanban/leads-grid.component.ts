import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateEnquiryComponent } from "app/main/enquiry/createEnquiry.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import { EnquiryServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({

    templateUrl: './leads-grid.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]})

export class LeadsGridComponent extends AppComponentBase implements AfterViewInit,OnInit {

    @ViewChild('createEnquiryModal') createEnquiryModal: CreateEnquiryComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';



    constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private route:Router,
        private _enquiryService:EnquiryServiceProxy

    )
    {
        super(injector);

    }

    ngOnInit(){
        //console.log('its wrong worked');
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
        this._enquiryService.getEnquiryGrid(
            this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),
            data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event)
            ).subscribe(result=>{
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                //console.log(result.items,'All result');
                this.primengDatatableHelper.hideLoadingIndicator();
            });    

    }

    createLeads():void{

        this.createEnquiryModal.show();
    }


    deleteLeads(lead_list): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Lead', lead_list.name),
                isConfirmed => {
                if (isConfirmed) {
                    this._enquiryService.getDeleteEnquiry(lead_list.id).subscribe(result=>{
                        this.notify.info(this.l('Deleted Successfully'));
                        this.getData();
                    });
                }
            }
        );
    }

    editLeads(data): void {

        this.route.navigate(['app/main/leads-grid',data.id]);
    }


} 
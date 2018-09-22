import { Component, Injector, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute,Router } from '@angular/router';
import { Http } from '@angular/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from "moment";
import { CreateOrEditCompanyComponent } from "app/main/company/createEditNewCompany.component";
import { DataTable } from 'primeng/components/datatable/datatable';
import { Paginator } from 'primeng/components/paginator/paginator';
import {CompanyContactServiceProxy,CreateCompanyOrContact} from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';

@Component({

    templateUrl: './company.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
    })

export class CompanyComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createCompanyModal') createCompanyModal: CreateOrEditCompanyComponent;
    @ViewChild('dataTable') dataTable: DataTable;
    @ViewChild('paginator') paginator: Paginator;

    advancedFiltersAreShown: boolean = false;
    filterText: string = '';
    selectedPermission: string = '';



    constructor(
        injector: Injector,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private _company:CompanyContactServiceProxy,
        private route:Router

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

        this._company.getCompanys(this.filterText,
            this.primengDatatableHelper.getSorting(this.dataTable),data,
            this.primengDatatableHelper.getSkipCount(this.paginator, event))
            .subscribe((result) => {
                this.primengDatatableHelper.totalRecordsCount = result.totalCount;
                this.primengDatatableHelper.records = result.items;
                this.primengDatatableHelper.hideLoadingIndicator();
            });

    }

    createCompany():void{

        this.createCompanyModal.show(0);
    }


    deleteCompany(infotype: CreateCompanyOrContact): void {
        this.message.confirm(
            this.l('Are you sure to Delete the Company', infotype.name),
                isConfirmed => {
                if (isConfirmed) {
                    this._company.getDeleteCompany(infotype.id).subscribe(result=>{
                            this.notify.info(this.l('Deleted Successfully'));
                            this.getData();

                    },
                        (error)=>{
                            this.notify.error(this.l(error.details));
                        });
                }
            }
        );
    }

    editCompany(data): void {

        this.route.navigate(['app/main/company/'+data.id,0]);
    }


} 
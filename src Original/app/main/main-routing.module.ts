import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
// import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewCustomerTypeComponent } from './newCustomerType/newCustomerType.component';
import { InfoTypeComponent } from './InfoType/InfoType.component';
import { KanbanComponent } from "app/main/kanban/kanban.component";
import { newCompanyComponent } from "app/main/company/newCompany.component";
import { CompanyComponent } from "app/main/company/company.component";
import { CurrencyComponent } from "app/main/currency/currency.component";
import { EditEnquiryComponent } from "app/main/enquiry/editEnquiry.component";
import { LeadsGridComponent } from "app/main/kanban/leads-grid.component";
import { ActivityTypeComponent } from "app/main/activity/activity.component";
import { MileStoneComponent } from "app/main/mile-stone/mile-stone.component";
import { MonthlyViewComponent } from "app/main/monthly-view/monthly-view.component";
import { ContactConComponent } from "app/main/contact/contact.component";
import { MileStoneStatusComponent } from "app/main/milestoneStatus/mile-stone.component";
import { ContactNewModelComponent } from "app/main/contact/contact-model.component";
import { newContactComponent } from "app/main/contact/newContact.component";

import { ProductGroupComponent } from "app/main/productgroup/productgroup.component";
import { ProductSubGroupComponent } from "app/main/productSubGroup/productsubgroup.component";
import { ProductComponent } from "app/main/products/product.component";
import { DeliveryComponent } from "app/main/delivery/delivery.component";
import { FreightComponent } from "app/main/freight/freight.component";
import { PackingComponent } from "app/main/packing/packing.component";
import { QpaymentComponent } from "app/main/qpayment/qpayment.component";
import { QuotationStatusComponent } from "app/main/quotationStatus/quotationstatus.component";
import { TitleQuotationComponent } from "app/main/titleQuotation/titlequotation.component";
import { ValidityComponent } from "app/main/validity/validity.component";
import { WarrantyComponent } from "app/main/warranty/warranty.component";
import {QuotationComponent} from "app/main/Quotations/quotation.component";
import {CreateEditQuotationComponent} from "app/main/Quotations/create-or-edit-quotation.component";
import {ReportComponent} from "app/main/report/report.component";
import { ReasonComponent } from "app/main/reason/reason.component";
import { PriceLevelComponent } from "app/main/pricelevel/pricelevel.component"; 
import { SalesOrderComponent } from "app/main/salesorder/salesorder.component";
import { SalesOrderEditComponent } from "app/main/salesorder/salesorder-edit.component";
import { SubmittedReportComponent } from '@app/main/quotationReport/submittedReport.component';
import { WonReportComponent } from '@app/main/quotationReport/wonReport.component';
import { LostReportComponent } from '@app/main/quotationReport/lostReport.component';
import { GlobalReportComponent } from '@app/main/quotationReport/globalReport.component';
import { OtherReportComponent } from '@app/main/quotationReport/otherReport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard_Old', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'customer_type', component: NewCustomerTypeComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'info_type',     component: InfoTypeComponent,        data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'leads/monthly-view', component:MonthlyViewComponent, data:{permission:null} },
                    { path: 'leads', component: KanbanComponent },
                    { path: 'leads/:id', component: EditEnquiryComponent},
                    { path: 'leads-grid', component: LeadsGridComponent },
                    { path: 'leads-grid/:id', component: EditEnquiryComponent},
                    { path: 'company', component: CompanyComponent, data:{permission:null}},
                    { path: 'contact', component: ContactNewModelComponent, data:{permission:null} },
                    { path: 'company/:id/:enqId', component: newCompanyComponent, data:{permission:null}},
                    { path: 'currency', component: CurrencyComponent,data:{permission:null}},
                    { path: 'activity-type', component: ActivityTypeComponent, data:{permission:null}},
                    { path: 'milestone', component: MileStoneComponent, data:{permission:null}},
                    { path: 'milestone-status',     component: MileStoneStatusComponent, data: { permission: null} },
                    { path: 'contact/:id/:enqId', component: newContactComponent },
                    { path: 'company/contact/:id/:enqId', component: newContactComponent},
                    { path: 'productgroup', component: ProductGroupComponent, data:{permission:null} },
                    { path: 'productSubGroup', component: ProductSubGroupComponent, data:{permission:null} },
                    { path: 'products', component: ProductComponent, data:{permission:null} },
                    { path: 'delivery', component: DeliveryComponent, data:{permission:null} },
                    { path: 'freight', component: FreightComponent, data:{permission:null} },
                    { path: 'packing', component: PackingComponent, data:{permission:null} },
                    { path: 'qpayment', component: QpaymentComponent, data:{permission:null} },
                    { path: 'quotationStatus', component: QuotationStatusComponent, data:{permission:null} },
                    { path: 'titleQuotation', component: TitleQuotationComponent, data:{permission:null} },
                    { path: 'validity', component: ValidityComponent, data:{permission:null} },
                    { path: 'warranty', component: WarrantyComponent, data:{permission:null} },
                    { path: 'quotation', component: QuotationComponent, data:{permission:null} },
                    { path: 'quotation/createquotation', component: CreateEditQuotationComponent, data:{permission:null} },
                    { path: 'quotation/editquotation/:id', component: CreateEditQuotationComponent, data:{permission:null} },
                    { path:'dashboard', component:ReportComponent, data:{permission:null}},
                    { path: 'reason', component: ReasonComponent, data:{permission:null} },
					{ path: 'pricelevel', component: PriceLevelComponent, data:{permission:null} },
                    { path: 'salesorder', component: SalesOrderComponent, data:{permission:null} },
                    { path: 'submittedReport', component: SubmittedReportComponent},
                    { path: 'wonReport', component: WonReportComponent},
                    { path: 'lostReport', component: LostReportComponent},                   
                    { path: 'globalReport', component: GlobalReportComponent},
                    { path: 'otherReport', component: OtherReportComponent},
                    { path: 'salesorder/editsalesorder/:id/:static_number', component: SalesOrderEditComponent, data:{permission:null} }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { 

    constructor(private router: Router) {
        router.events.subscribe(() => {
            this.hideOpenDataTableDropdownMenus();
        });
    }

    hideOpenDataTableDropdownMenus(): void {
        var $dropdownMenus = $('.dropdown-menu.tether-element');
        $dropdownMenus.css({
            'display': 'none'
        });
        $('.page-sidebar-menu').addClass("page-sidebar-menu-closed");
    }


}
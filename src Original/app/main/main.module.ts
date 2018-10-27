import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { MainRoutingModule } from './main-routing.module';
import { CountoModule } from '@node_modules/angular2-counto';
import { EasyPieChartModule } from 'ng2modules-easypiechart';
import {NewCustomerTypeComponent} from './newCustomerType/newCustomerType.component';
import {InfoTypeComponent} from './InfoType/InfoType.component';
import { DataTableModule, OverlayPanelModule, ListboxModule, SharedModule, MultiSelectModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { CreateOrEditNewCustomerTypeComponent } from "app/main/newCustomerType/createEditNewCustomerType.component";
import { CreateOrEditNewInfoTypeComponent } from "app/main/InfoType/createEditNewInfoType.component";
import { KanbanComponent } from "app/main/kanban/kanban.component";
import { newCompanyComponent } from "app/main/company/newCompany.component";
import { AddressComponent } from "app/main/company/address.component";
import { ContactCompComponent } from "app/main/company/contact.component";
import { SelectModule } from 'ng2-select';
import { CompanyComponent } from "app/main/company/company.component";
import { CreateOrEditCompanyComponent } from "app/main/company/createEditNewCompany.component";
import { CreateCurrencyModalComponent } from "app/main/currency/create-or-edit-currency.component";
import { CurrencyComponent } from "app/main/currency/currency.component";
import { CreateEnquiryComponent } from "app/main/enquiry/createEnquiry.component";
import { EditEnquiryComponent } from "app/main/enquiry/editEnquiry.component";
import { LeadsGridComponent } from "app/main/kanban/leads-grid.component";
import { ActivityTypeComponent } from "app/main/activity/activity.component"; 
import { CreateActivityModalComponent } from "app/main/activity/create-or-edit-activity.component";
import { CreateActivityComponent } from "app/main/enquiry/createActivity.component";
import { MileStoneComponent } from "app/main/mile-stone/mile-stone.component";
import { CreateOrEditMileStoneModalComponent } from "app/main/mile-stone/create-edit-mileStone.component";
import { MonthlyViewComponent } from "app/main/monthly-view/monthly-view.component";
// import { ClosedDealNotificationComponent } from "app/main/closed-deal-notification/closed-deal-notification.component";
import { QuillEditorModule } from 'ngx-quill-editor';
import { ColorPickerModule } from 'ngx-color-picker';
import { MileStoneStatusComponent } from "app/main/milestoneStatus/mile-stone.component";
import { CreateOrEditMileStoneStatusComponent } from "app/main/milestoneStatus/create-edit-mileStone.component";

import { ContactNewModelComponent } from "app/main/contact/contact-model.component";
import { ContactConComponent } from "app/main/contact/contact.component";
import { CreateOrEditContactNewModalComponent } from "app/main/contact/create-edit-contact.component";
import { newContactComponent } from "app/main/contact/newContact.component";
import { ContactAddressNewComponent } from "app/main/contact/address.component";
import { MomentModule } from 'angular2-moment';

import { ProductGroupComponent } from "app/main/productgroup/productgroup.component"; 
import { CreateProductGroupModalComponent } from "app/main/productgroup/create-or-edit-productgroup.component";
import { ProductSubGroupComponent } from "app/main/productSubGroup/productsubgroup.component"; 
import { CreateproductsubgroupModalComponent } from "app/main/productSubGroup/create-or-edit-productsubgroup.component";
import { ProductComponent } from "app/main/products/product.component"; 
import { CreateEditProductComponent } from "app/main/products/create-or-edit-product.component";
import { CalendarModule } from 'primeng/primeng';



import { DeliveryComponent } from "app/main/delivery/delivery.component";
import { CreateDeliveryComponent } from "app/main/delivery/create-or-edit-delivery.component";
import { FreightComponent } from "app/main/freight/freight.component"; 
import { CreateFreightComponent } from "app/main/freight/create-or-edit-freight.component";
import { PackingComponent } from "app/main/packing/packing.component"; 
import { CreatePackingComponent } from "app/main/packing/create-or-edit-packing.component";

import { QpaymentComponent } from "app/main/qpayment/qpayment.component"; 
import { CreateQpaymentComponent } from "app/main/qpayment/create-or-edit-qpayment.component";

import { QuotationStatusComponent } from "app/main/quotationStatus/quotationstatus.component"; 
import { CreateQuotationStatusComponent } from "app/main/quotationStatus/create-or-edit-quotationstatus.component";

import { TitleQuotationComponent } from "app/main/titleQuotation/titlequotation.component"; 
import { CreateTitleOfQuotationComponent } from "app/main/titleQuotation/create-or-edit-titlequotation.component";

import { ValidityComponent } from "app/main/validity/validity.component"; 
import { CreateValidityComponent } from "app/main/validity/create-or-edit-validity.component";

import { WarrantyComponent } from "app/main/warranty/warranty.component"; 
import { CreateWarrantyComponent } from "app/main/warranty/create-or-edit-warranty.component";

import {QuotationComponent} from "app/main/Quotations/quotation.component";
import {CreateEditQuotationComponent} from "app/main/Quotations/create-or-edit-quotation.component";
import {CreateEditQProductComponent} from "app/main/Quotations/create-or-edit-product.component";
import { CreateQModalComponent } from "app/main/Quotations/create-or-edit-quot.component";
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import {ReportComponent} from "app/main/report/report.component";
import { QuotationPreviewModalComponent } from "app/main/Quotations/quotation-preview.component";
import { ChartsModule } from 'ng2-charts';

import { ReasonComponent } from "app/main/reason/reason.component";
import { CreateReasonComponent } from "app/main/reason/create-or-edit-reason.component";

import { PriceLevelComponent } from "app/main/pricelevel/pricelevel.component"; 
import { CreatePricelevelComponent } from "app/main/pricelevel/create-or-edit-pricelevel.component";

import { SalesOrderComponent } from "app/main/salesorder/salesorder.component";
import { SalesOrderEditComponent } from "app/main/salesorder/salesorder-edit.component";
import { Ng2Carousel3dModule }  from 'ng2-carousel-3d';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { CreatePaymentCollectionComponent } from '@app/main/salesorder/create-or-edit-paymentCollection.component';
import { CreatePaymentScheduleComponent } from '@app/main/salesorder/create-or-edit-paymentSchedule.component';
import { CreateServiceComponent } from '@app/main/products/create-or-edit-service.component';
import { CreateEditqserviceComponent } from '@app/main/Quotations/create-or-edit-qservice.component';
import { DragulaModule } from 'ng2-dragula';
import { SubmittedReportComponent } from '@app/main/quotationReport/submittedReport.component';
import { WonReportComponent } from '@app/main/quotationReport/wonReport.component';
import { LostReportComponent } from '@app/main/quotationReport/lostReport.component';
import { GlobalReportComponent } from '@app/main/quotationReport/globalReport.component';
import { OtherReportComponent } from '@app/main/quotationReport/otherReport.component';
import { CreateReportComponent } from '@app/main/quotationReport/createReport.component';
import { MileStoneFilterComponent } from '@app/main/reportFilters/mileStoneFilterModal.component';
import { MileStoneStatusFilterComponent } from '@app/main/reportFilters/mileStoneStatusFilterModal.component';
import { SalespersonFilterComponent } from '@app/main/reportFilters/salespersonFilterModal.component';
import { ClosureDateFilterComponent } from '@app/main/reportFilters/closureDateFilterModal.component';
import { ContactFilterComponent } from '@app/main/reportFilters/contactFilterModal.component';
import { CompanyFilterComponent } from '@app/main/reportFilters/companyFilterModal.component';
import { CreatorFilterComponent } from '@app/main/reportFilters/creatorFilterModal.component';
import { QuotationStatusFilterComponent } from '@app/main/reportFilters/quotationStatusFilterModal.component';
import { CustomerTypeFilterComponent } from '@app/main/reportFilters/customerTypeFilterModal.component';
import { CountryFilterComponent } from '@app/main/reportFilters/countryFilterModal.component';
import { CurrencyFilterComponent } from '@app/main/reportFilters/currencyFilterModal.component';
export function highchartsFactory() {
    const hc = require('highcharts');
    const dd = require('highcharts/modules/drilldown');
    const fu = require('highcharts/modules/funnel');
    dd(hc);
    fu(hc);
    return hc;
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        CountoModule,
		EasyPieChartModule,
		ChartModule,
		DataTableModule,
		PaginatorModule,
        DragulaModule,
        SelectModule,
        QuillEditorModule,
		ColorPickerModule,
		MomentModule,
		CalendarModule,
        FileUploadModule,
		ChartsModule,
		Ng2Carousel3dModule,
		OverlayPanelModule,
		ListboxModule,
		SharedModule,
		MultiSelectModule

    ],
    declarations: [

        DashboardComponent,
		NewCustomerTypeComponent,
		InfoTypeComponent,
		CreateOrEditNewCustomerTypeComponent,
		CreateOrEditNewInfoTypeComponent,
        KanbanComponent,
        AddressComponent,
        ContactCompComponent,
        newCompanyComponent,
        CompanyComponent,
        CreateOrEditCompanyComponent,
        CurrencyComponent,
        CreateCurrencyModalComponent,
        CreateEnquiryComponent,
        EditEnquiryComponent,
        LeadsGridComponent,
        ActivityTypeComponent,
        CreateActivityModalComponent,CreateActivityComponent,
        MileStoneComponent,
        CreateOrEditMileStoneModalComponent,
        MonthlyViewComponent,
		ContactNewModelComponent,
        ContactConComponent,
        CreateOrEditContactNewModalComponent,
        newContactComponent,
        ContactAddressNewComponent,
		MileStoneStatusComponent,
		CreateOrEditMileStoneStatusComponent,
		ProductGroupComponent,
		CreateProductGroupModalComponent,
		ProductSubGroupComponent,
		CreateproductsubgroupModalComponent,
		ProductComponent,
		ReasonComponent,
		CreateReasonComponent,
		ReportComponent,
		CreateEditProductComponent,
		CreateEditQuotationComponent,
		CreateEditQProductComponent,
		CreateQModalComponent,
		DeliveryComponent,
		CreateFreightComponent,
		QuotationComponent,
		QuotationPreviewModalComponent,
	    CreateDeliveryComponent,
		FreightComponent, 
		PackingComponent,
		CreatePackingComponent,
		QpaymentComponent,
		CreateQpaymentComponent,
		QuotationStatusComponent,
		CreateQuotationStatusComponent,
		TitleQuotationComponent,
		CreateTitleOfQuotationComponent,
		ValidityComponent,
		CreateValidityComponent,
		WarrantyComponent,
		CreateWarrantyComponent,
		PriceLevelComponent,
		CreatePricelevelComponent,
		SalesOrderComponent,
		SalesOrderEditComponent,
		CreatePaymentCollectionComponent,
		CreatePaymentScheduleComponent,
		CreateServiceComponent,
		CreateEditqserviceComponent,		
		SubmittedReportComponent,
		WonReportComponent,
		LostReportComponent,
		GlobalReportComponent,
		OtherReportComponent,
		CreateReportComponent,
		MileStoneFilterComponent,
		ClosureDateFilterComponent,
		MileStoneStatusFilterComponent,
		SalespersonFilterComponent,
		CompanyFilterComponent,
		ContactFilterComponent,
		CreatorFilterComponent,
		CountryFilterComponent,
		CurrencyFilterComponent,
		CustomerTypeFilterComponent,
		QuotationStatusFilterComponent
	],
	providers: [{
        provide: HighchartsStatic, 
        useFactory: highchartsFactory
      }]
})
export class MainModule { }
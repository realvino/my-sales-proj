﻿import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule, TabsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { AdminRoutingModule } from './admin-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@app/shared/common/app-common.module'

import { UsersComponent } from './users/users.component'
import { PermissionComboComponent } from './shared/permission-combo.component';
import { RoleComboComponent } from './shared/role-combo.component';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component'
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { FeatureTreeComponent } from './shared/feature-tree.component';

import { RolesComponent } from './roles/roles.component'
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component'

import { AuditLogsComponent } from './audit-logs/audit-logs.component'
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component'

import { HostSettingsComponent } from './settings/host-settings.component'
import { MaintenanceComponent } from './maintenance/maintenance.component'
import { EditionsComponent } from './editions/editions.component'
import { CreateOrEditEditionModalComponent } from './editions/create-or-edit-edition-modal.component'
import { ImpersonationService } from './users/impersonation.service';
import { LanguagesComponent } from './languages/languages.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { CreateOrEditLanguageModalComponent } from './languages/create-or-edit-language-modal.component';
import { TenantsComponent } from './tenants/tenants.component'
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component'
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component'
import { TenantFeaturesModalComponent } from './tenants/tenant-features-modal.component'
import { EditTextModalComponent } from './languages/edit-text-modal.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { OrganizationTreeComponent } from './organization-units/organization-tree.component';
import { OrganizationUnitMembersComponent } from './organization-units/organization-unit-members.component';
import { CreateOrEditUnitModalComponent } from './organization-units/create-or-edit-unit-modal.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component'
import { HostDashboardComponent } from './dashboard/host-dashboard.component'
import { EditionComboComponent } from './shared/edition-combo.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { DataTableModule,CalendarModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { AddMemberModalComponent } from "app/admin/organization-units/add-member-modal.component";
import {MonthPicker} from "app/admin/users/month";
import {DatePicker} from "app/admin/users/year";
import { MomentModule } from 'angular2-moment';
import { CreateTargetComponent } from '@app/admin/settings/createTarget.component';
import { CreateUserTargetComponent } from '@app/admin/users/createUserTarget.component';
import { SelectModule } from 'ng2-select/select/select.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        AdminRoutingModule,
        SelectModule,
        UtilsModule,
        AppCommonModule,
        DataTableModule,
        PaginatorModule,
        CalendarModule,
        MomentModule
    ],
    declarations: [
        UsersComponent,
        PermissionComboComponent,
        RoleComboComponent,
        CreateOrEditUserModalComponent,
        EditUserPermissionsModalComponent,
        PermissionTreeComponent,
        FeatureTreeComponent,
        RolesComponent,
        CreateOrEditRoleModalComponent,
        AuditLogsComponent,
        AuditLogDetailModalComponent,
        HostSettingsComponent,
        MaintenanceComponent,
        EditionsComponent,
        CreateOrEditEditionModalComponent,
        LanguagesComponent,
        LanguageTextsComponent,
        CreateOrEditLanguageModalComponent,
        TenantsComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        TenantFeaturesModalComponent,
        CreateOrEditLanguageModalComponent,
        EditTextModalComponent,
        OrganizationUnitsComponent,
        OrganizationTreeComponent,
        OrganizationUnitMembersComponent,
        CreateOrEditUnitModalComponent,
        TenantSettingsComponent,
        HostDashboardComponent,
        EditionComboComponent,
        SubscriptionManagementComponent,
        AddMemberModalComponent,
        MonthPicker,
        DatePicker,
		CreateTargetComponent,
        CreateUserTargetComponent
    ],
    exports: [
        AddMemberModalComponent
    ],
    providers: [
        ImpersonationService
    ]
})
export class AdminModule { }
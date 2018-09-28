import { Component, Injector } from '@angular/core';
import { SideBarMenu } from './side-bar-menu';
import { SideBarMenuItem } from './side-bar-menu-item';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    templateUrl: './side-bar.component.html',
    selector: 'side-bar'
})
export class SideBarComponent extends AppComponentBase {

    constructor(
        injector: Injector,
        public permission: PermissionCheckerService,
        private _appSessionService: AppSessionService) {
        super(injector);
    }

    menu: SideBarMenu = new SideBarMenu("MainMenu", "MainMenu", [
          new SideBarMenuItem("Dashboard", "Pages.Administration.Host.Dashboard", "icon-home", "/app/admin/hostDashboard"),
          new SideBarMenuItem("Dashboard", "Pages.Tenant.Dashboard", "icon-home", "",[
            new SideBarMenuItem("Dashboard", "Pages.Tenant.Dashboard.Dashboard", "icon-home", "/app/main/dashboard"),
            new SideBarMenuItem("Sales Dashboard", "Pages.Tenant.Dashboard.SalesDashboard", "fa fa-dashboard", "")
          ]),
          new SideBarMenuItem("Tenants", "Pages.Tenants", "icon-globe", "/app/admin/tenants"),
          new SideBarMenuItem("Editions", "Pages.Editions", "icon-grid", "/app/admin/editions"),

          new SideBarMenuItem("Leads","Pages.Tenant.Leads", "icon-list","",[
            new SideBarMenuItem("Leads", "Pages.Tenant.Leads.Leads", "icon-list","/app/main/leads")
        ]),
		
		new SideBarMenuItem("Quotation", "Pages.Tenant.Quotation", "fa fa-handshake-o", "", [
            new SideBarMenuItem("Quotations", "Pages.Tenant.Quotation.Quotations", "fa fa-bitbucket", "/app/main/quotation"),
            new SideBarMenuItem("QuotationStatus", "Pages.Tenant.Quotation.QuotationStatus", "fa fa-id-card-o", "/app/main/quotationStatus"),
            new SideBarMenuItem("Quotation Master", "Pages.Tenant.Quotation.QuotationMaster", "fa fa-superpowers", "",[

                    new SideBarMenuItem("Delivery", "Pages.Tenant.Quotation.QuotationMaster.Delivery", "fa fa-motorcycle", "/app/main/delivery"),
                    new SideBarMenuItem("Reason", "Pages.Tenant.Quotation.QuotationMaster.Reason", "icon-list", "/app/main/reason"),
                    new SideBarMenuItem("Freight", "Pages.Tenant.Quotation.QuotationMaster.Freight", "fa fa-truck", "/app/main/freight"),
                    new SideBarMenuItem("Packing", "Pages.Tenant.Quotation.QuotationMaster.Packing", "fa fa-shopping-bag", "/app/main/packing"),
                    new SideBarMenuItem("QPayment", "Pages.Tenant.Quotation.QuotationMaster.QPayment", "fa fa-credit-card", "/app/main/qpayment"),
                    new SideBarMenuItem("TitleOfQuotation", "Pages.Tenant.Quotation.QuotationMaster.TitleOfQuotation", "fa fa-file", "/app/main/titleQuotation"),
                    new SideBarMenuItem("Validity", "Pages.Tenant.Quotation.QuotationMaster.Validity", "fa fa-spinner", "/app/main/validity"),
                    new SideBarMenuItem("Warranty", "Pages.Tenant.Quotation.QuotationMaster.Warranty", "fa fa-thumbs-up", "/app/main/warranty")
                ]),
            new SideBarMenuItem("SalesOrder", "Pages.Tenant.Quotation.SalesOrder", "fa fa-shopping-cart", "/app/main/salesorder")
        ]),
       
		new SideBarMenuItem("Product Family", "Pages.Tenant.ProductFamily", "fa fa-cubes", "", [
               new SideBarMenuItem("ProductGroup", "Pages.Tenant.ProductFamily.ProductGroup", "fa fa-cubes", "/app/main/productgroup"),
               new SideBarMenuItem("ProductSubgroup", "Pages.Tenant.ProductFamily.ProductSubgroup", "fa fa-th-list", "/app/main/productSubGroup"),
               new SideBarMenuItem("Products", "Pages.Tenant.ProductFamily.Products", "fa fa-cube", "/app/main/products"),
               new SideBarMenuItem("Price Level", "Pages.Tenant.ProductFamily.PriceLevel", "icon-list","/app/main/pricelevel")
        ]),
        new SideBarMenuItem("Address Book", "Pages.Tenant.AddressBook", "fa fa-address-book-o", "", [
            new SideBarMenuItem("Company", "Pages.Tenant.AddressBook.Company", "fa fa-university", "/app/main/company"),
            new SideBarMenuItem("Contact", "Pages.Tenant.AddressBook.Contact", "fa fa-phone", "/app/main/contact"),
            new SideBarMenuItem("Customer Type", "Pages.Tenant.Master.CustomerType", "fa fa-user", "/app/main/customer_type"),
            new SideBarMenuItem("Info Type", "Pages.Tenant.Master.InfoType", "fa fa-book", "/app/main/info_type")
      
        ]),
        new SideBarMenuItem("Master", "Pages.Tenant.Master", "icon-globe", "", [
            new SideBarMenuItem("Activity Type", "Pages.Tenant.Master.ActivityType", "fa fa-chain", "/app/main/activity-type"),
            new SideBarMenuItem("MileStone", "Pages.Tenant.Master.MileStone", "fa fa-line-chart", "/app/main/milestone"),
			new SideBarMenuItem("MileStone Status", "Pages.Tenant.Master.MileStoneStatus", "fa fa-flask", "/app/main/milestone-status"),
            new SideBarMenuItem("Currency", "Pages.Tenant.Master.Currency", "fa fa-dollar", "/app/main/currency")
              ]),
              new SideBarMenuItem("Reports", "", "fa fa-file", "", [
                new SideBarMenuItem("Submitted Report", "", "fa fa-thumb-tack", "/app/main/submittedReport"),
                new SideBarMenuItem("Won Report", "", "fa fa-thumbs-up", "/app/main/wonReport"),
                new SideBarMenuItem("Lost Report", "", "fa fa-thumbs-down", "/app/main/lostReport"),
                new SideBarMenuItem("Global Report", "", "fa fa-globe", "/app/main/globalReport"),
                new SideBarMenuItem("Other Reports", "", "fa fa-object-group", "/app/main/otherReport")
            ]),    
        new SideBarMenuItem("Administration", "Pages.Administration", "icon-wrench", "", [
            // new SideBarMenuItem("OrganizationUnits", "Pages.Administration.OrganizationUnits", "icon-layers", "/app/admin/organization-units"),
            new SideBarMenuItem("Roles", "Pages.Administration.Roles", "icon-briefcase", "/app/admin/roles"),
            new SideBarMenuItem("Users", "Pages.Administration.Users", "icon-people", "/app/admin/users"),
            // new SideBarMenuItem("Languages", "Pages.Administration.Languages", "icon-flag", "/app/admin/languages"),
            // new SideBarMenuItem("AuditLogs", "Pages.Administration.AuditLogs", "icon-lock", "/app/admin/auditLogs"),
            new SideBarMenuItem("Maintenance", "Pages.Administration.Host.Maintenance", "icon-wrench", "/app/admin/maintenance"),
            new SideBarMenuItem("Subscription", "Pages.Administration.Tenant.SubscriptionManagement", "icon-refresh", "/app/admin/subscription-management"),
            new SideBarMenuItem("Settings", "Pages.Administration.Host.Settings", "icon-settings", "/app/admin/hostSettings"),
            new SideBarMenuItem("Settings", "Pages.Administration.Tenant.Settings", "icon-settings", "/app/admin/tenantSettings")
        ])
      /*  new SideBarMenuItem("Report","", "icon-list","",[
            new SideBarMenuItem("Report", "", "icon-list","/app/main/report")
        ])
*/

    ]);

    checkChildMenuItemPermission(menuItem): boolean {

        for (var i = 0; i < menuItem.items.length; i++) {
            var subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this.permission.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem): boolean {

        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        }

        if (menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }
        return true;
    }

}
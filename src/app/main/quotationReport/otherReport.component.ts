import { Component, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateReportComponent } from '@app/main/quotationReport/createReport.component';

@Component({
    templateUrl: './otherReport.component.html',
    animations: [appModuleAnimation()]
})

export class OtherReportComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('createReportModal') createReportModal: CreateReportComponent;
    constructor(
        injector: Injector,
    )
    {
        super(injector);
    }

    ngAfterViewInit(): void {
	}
    
    createReport(){
        this.createReportModal.show();
    }
} 
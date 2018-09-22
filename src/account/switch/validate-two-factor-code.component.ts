import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { SwitchService } from './switch.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './validate-two-factor-code.component.html',
    styleUrls: ['./validate-two-factor-code.component.less'],
    animations: [accountModuleAnimation()]
})
export class ValidateTwoFactorCodeComponentSwitch extends AppComponentBase implements CanActivate, OnInit, OnDestroy {

    code: string;
    submitting: boolean = false;
    remainingSeconds: number = 90;
    timerSubscription: Subscription;

    constructor(
        injector: Injector,
        public switchService: SwitchService,
        private _router: Router
    ) {
        super(injector);
    }

    canActivate(): boolean {
        if (this.switchService.authenticateModel &&
            this.switchService.authenticateResult
        ) {
            return true;
        }

        return false;
    }

    ngOnInit(): void {
        let timer = Observable.timer(1000, 1000);
        this.timerSubscription = timer.subscribe(() => {
            this.remainingSeconds = this.remainingSeconds - 1;
            if (this.remainingSeconds <= 0) {
                this.message.warn(this.l('TimeoutPleaseTryAgain')).done(() => {
                    this._router.navigate(['account/login']);
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = null;
        }
    }

    submit(): void {
        this.switchService.authenticateModel.twoFactorVerificationCode = this.code;
        this.switchService.authenticate();
    }
}
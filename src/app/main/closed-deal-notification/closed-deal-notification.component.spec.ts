import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedDealNotificationComponent } from './closed-deal-notification.component';

describe('ClosedDealNotificationComponent', () => {
  let component: ClosedDealNotificationComponent;
  let fixture: ComponentFixture<ClosedDealNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedDealNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedDealNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileStoneStatusComponent } from './mile-stone.component';

describe('MileStoneStatusComponent', () => {
  let component: MileStoneStatusComponent;
  let fixture: ComponentFixture<MileStoneStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileStoneStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileStoneStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});


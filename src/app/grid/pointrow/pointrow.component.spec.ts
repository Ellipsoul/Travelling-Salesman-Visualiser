import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointrowComponent } from './pointrow.component';

describe('PointrowComponent', () => {
  let component: PointrowComponent;
  let fixture: ComponentFixture<PointrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

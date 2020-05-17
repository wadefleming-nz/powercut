import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncidentPage } from './incident.page';

describe('IncidentPage', () => {
  let component: IncidentPage;
  let fixture: ComponentFixture<IncidentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

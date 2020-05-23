import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IncidentAddedPage } from './incident-added.page';

describe('IncidentAddedPage', () => {
  let component: IncidentAddedPage;
  let fixture: ComponentFixture<IncidentAddedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentAddedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentAddedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatsComponent } from './account-stats.component';

describe('AccountStatsComponent', () => {
  let component: AccountStatsComponent;
  let fixture: ComponentFixture<AccountStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

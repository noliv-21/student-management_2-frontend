import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCredComponent } from './user-cred.component';

describe('UserCredComponent', () => {
  let component: UserCredComponent;
  let fixture: ComponentFixture<UserCredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

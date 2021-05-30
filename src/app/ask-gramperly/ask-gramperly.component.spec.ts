import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskGramperlyComponent } from './ask-gramperly.component';

describe('AskGramperlyComponent', () => {
  let component: AskGramperlyComponent;
  let fixture: ComponentFixture<AskGramperlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskGramperlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskGramperlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViewerComponent } from './test-viewer.component';

describe('TestViewerComponent', () => {
  let component: TestViewerComponent;
  let fixture: ComponentFixture<TestViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestViewerComponent]
    });
    fixture = TestBed.createComponent(TestViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

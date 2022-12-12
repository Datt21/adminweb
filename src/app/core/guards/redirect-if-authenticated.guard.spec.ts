import { TestBed, async, inject } from '@angular/core/testing';

import { RedirectIfAuthenticatedGuard } from './redirect-if-authenticated.guard';

describe('RedirectIfAuthenticatedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectIfAuthenticatedGuard]
    });
  });

  it('should ...', inject([RedirectIfAuthenticatedGuard], (guard: RedirectIfAuthenticatedGuard) => {
    expect(guard).toBeTruthy();
  }));
});

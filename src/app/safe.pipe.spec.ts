import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('SafePipe', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: (url: string) => `sanitized:${url}`,
          },
        },
      ],
    });
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('create an instance', () => {
    const pipe = new SafePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });

  it('should sanitize URL', () => {
    const pipe = new SafePipe(sanitizer);
    const url = 'http://unsafe.url';
    expect(pipe.transform(url)).toBe(`sanitized:${url}`);
  });
});

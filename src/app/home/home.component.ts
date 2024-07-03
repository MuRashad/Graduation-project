import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('contactSection') contactSection: ElementRef;
  @ViewChild('blogSection') blogSection: ElementRef;
 

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.scrollToElementInNavBar();
  }

  scrollToElementInNavBar(): void {
    if (this.contactSection) {
      this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (this.blogSection) {
      this.blogSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }


}
}
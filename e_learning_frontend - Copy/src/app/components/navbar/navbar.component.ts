import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isSidebarShowing = false;
  isMenuScrolled = false;
  

  @HostListener('window:scroll', ['$event'])
  scrollCheck() {
    if (window.pageYOffset > 100)
      this.isMenuScrolled = true;
    else
      this.isMenuScrolled = false;


    // console.log(this.isMenuScrolled)
  }
  openSideBar() {
    this.isSidebarShowing = true;
  }

  closeSideBar() {
    this.isSidebarShowing = false;
  }
  scrollToTop() {
    document.body.scrollIntoView({ behavior: 'smooth' })
  }
}

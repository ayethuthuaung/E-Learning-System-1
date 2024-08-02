import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isSidebarShowing = false;
  isMenuScrolled = false;

  loggedUser: any = '';
  id: number = 0;
  name: string = '';
  roles: string[] = [];
  showRoleName: { [key: string]: boolean } = {};
  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
       
        this.id = this.loggedUser.id;
        this.name = this.loggedUser.name;
        this.roles = this.loggedUser.roles.map((role: any) => role.name);
        console.log(this.id);

        this.roles.forEach(role => {
          this.showRoleName[role] = false;
        });
      }
    }
  }
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

  toggleRoleName(role: string) {
    this.showRoleName[role] = !this.showRoleName[role];
  }
}

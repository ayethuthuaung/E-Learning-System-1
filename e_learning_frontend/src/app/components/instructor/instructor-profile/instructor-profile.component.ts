import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.css']
})
export class InstructorProfileComponent implements OnInit {
  photo: any = '';
  name: string = '';
  team: string = '';
  department: string = '';
  division: string = '';
  loggedUser: any = '';
  id: number = 0;
  roles: string[] = [];
  selectedFile: File | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = JSON.parse(storedUser);
      console.log(this.loggedUser);

      if (this.loggedUser) {
        this.photo = this.loggedUser.photo;
        this.name = this.loggedUser.name;
        this.team = this.loggedUser.team;
        this.department = this.loggedUser.department;
        this.division = this.loggedUser.division;
        this.id = this.loggedUser.id;
        console.log(this.id);
        console.log('Roles Data:', this.loggedUser.roles);
        this.roles = this.loggedUser.roles.map((role: any) => role.name);
        console.log('Mapped Roles:', this.roles);
        
      }
    }
  }

  onFileSelected(event: any): void {
    console.log("Hi");

    const file: File = event.target.files[0];
    console.log(file);

    if (file) {
      console.log("Hi");
      this.selectedFile = file;
      this.updateProfile();
    }
  }

  updateProfile(): void {
    if (this.selectedFile && this.loggedUser) {
      this.userService.updateProfile(this.selectedFile, this.id).subscribe(
        (response: any) => {
          console.log('Profile updated successfully:', response);
          this.photo = response.url;
          this.loggedUser.photo = this.photo;
          localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
        },
        error => {
          console.error('Error updating profile:', error);
          // Handle error response
        }
      );
    }
  }

  downloadPhoto(): void {
    if (this.photo) {
      fetch(this.photo)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'profile-picture.jpg';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          alert('Your profile picture has been downloaded.');
        })
        .catch(error => console.error('Error downloading the photo:', error));
    }
  }
}

import { Component, Input,OnInit } from '@angular/core';
import { currentUser } from '../../state/model';
import { AuthService } from '../../services/auth.service';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  @Input() user!:currentUser;
  selectedFile: File | null = null;
  profileImageUrl:string | null = null;

  constructor(private cloudinaryService:CloudinaryService,private authService:AuthService){}

  ngOnInit():void{
    if (this.user && this.user.profileImage) {
      this.profileImageUrl = this.user.profileImage;
    }
  }
  
  onFileSelected(event:any){
    this.selectedFile = event.target.files[0];
  }

  uploadImage(){
    if(this.selectedFile){
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe((url:string)=>{
        const email = this.user.email;
        this.authService.updateProfileImage({ profileImage: url, email }).subscribe(()=>{
          this.profileImageUrl = url;
        })
      })
    }
  }
}

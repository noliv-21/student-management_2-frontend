import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-cred',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './user-cred.component.html',
  styleUrl: './user-cred.component.scss'
})
export class UserCredComponent {
  @Input() mode: 'login' | 'signup'='login';
  loginForm!: FormGroup;

  ngOnInit(){
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['mode']){
      console.log(Object.keys(changes));
      this.initializeForm();
    }
  }

  onSubmit(){
    if(this.loginForm.valid){
      if(this.mode === 'login'){
        
      }else{

      }
    }
  }
  initializeForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', this.mode === 'signup' ? [Validators.required, Validators.email] : null),
      confirmPassword: new FormControl('', this.mode === 'signup' ? Validators.required : null),
    });
  }
}

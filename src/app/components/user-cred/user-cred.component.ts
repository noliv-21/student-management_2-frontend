import { Component, OnInit, Input,Output, OnChanges,OnDestroy, SimpleChanges, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../state/actions';
import { tap } from 'rxjs';
import { Subscription } from 'rxjs';
import { selectAuthUser, selectAuthError } from '../../state/selectors';

@Component({
  selector: 'app-user-cred',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './user-cred.component.html',
  styleUrl: './user-cred.component.scss'
})
export class UserCredComponent {
  @Input() mode: 'login' | 'signup' | 'addUser'='login';
  @Output() userAdded = new EventEmitter<void>();

  loginForm!: FormGroup;
  isAdmin:Boolean=false;
  isNewUser:Boolean=false;

  private authUserSubscription!: Subscription;
  private authErrorSubscription!: Subscription;

  constructor(private fb: FormBuilder,private store:Store){}

  ngOnInit(){
    this.initializeForm();

    this.authUserSubscription=this.store.select(selectAuthUser).pipe(
      tap(user=>{
        if(user && this.isNewUser){
          console.log('inside the tap');
          this.userAdded.emit();
          this.isNewUser=false;
        }
      })
    ).subscribe();

    this.authErrorSubscription=this.store.select(selectAuthError).pipe(
      tap(error => {
        if (error) {
          console.error('Signup failed:', error);
        }
      })
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['mode']){
      console.log(Object.keys(changes));
      this.initializeForm();
    }
  }

  onSubmit(){
    if(this.loginForm.valid){
      const formValues = this.loginForm.value;
      if(this.mode === 'login'){
        console.log('Login values:', formValues);
        const username = this.loginForm.get('username')?.value;
        const password = this.loginForm.get('password')?.value;
        this.store.dispatch(AuthActions.login({
          credentials: {
            ...formValues,
            isAdmin:this.isAdmin
          },
          role: this.isAdmin===true ? 'admin':'user'
        }));
      }else{
        console.log('Sign up values', formValues);
        const username = this.loginForm.get('username')?.value;
        const password = this.loginForm.get('password')?.value;
        const email = this.loginForm.get('email')?.value;
        const confirmPassword = this.loginForm.get('confirmPassword')?.value;
        this.isNewUser=true;
        this.store.dispatch(AuthActions.signup({ credentials: formValues }));
        this.userAdded.emit();
      }
    }
  }
  initializeForm() {
    if (this.mode === 'addUser' || this.mode === 'signup') {
      console.log(this.mode);
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['',[Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  }
  toggleRole(){
    this.isAdmin=!this.isAdmin;
  }

  ngOnDestroy():void{
    if (this.authUserSubscription) {
      this.authUserSubscription.unsubscribe();
    }
    if (this.authErrorSubscription) {
      this.authErrorSubscription.unsubscribe();
    }
  }
}

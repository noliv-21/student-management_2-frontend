import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { selectAllUsers } from '../state/selectors';
import { Store } from '@ngrx/store';
import * as AdminActions from '../state/admin.actions';
import { Observable, map } from 'rxjs';
import { User } from '../state/model';
import { ReactiveFormsModule,FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { UserCredComponent } from '../components/user-cred/user-cred.component';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import {MatInputModule} from '@angular/material/input';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  imports: [HeaderComponent,CommonModule,UserCredComponent,MatIconModule,ReactiveFormsModule,MatInputModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit {
  showAddUserToggle:Boolean=false;
  addButtonText:'Add New User'|'Cancel'='Add New User';
  users$!: Observable<User[]>
  editUserForm!:FormGroup;
  editingUser:string | null=null;
  searchTerm:string='';
  constructor(private fb:FormBuilder,private store:Store,private dialog:MatDialog,private cdr:ChangeDetectorRef){}
  ngOnInit():void{
    this.store.dispatch(AdminActions.fetchUsers());
    this.users$=this.store.select(selectAllUsers);
    this.initializeForm();
  }
  onAddUser(){
    this.showAddUserToggle=!this.showAddUserToggle;
    this.addButtonText=this.showAddUserToggle?'Cancel':'Add New User';
    this.cdr.detectChanges();
  }
  onUserAdded(){
    this.showAddUserToggle=false;
    this.addButtonText='Add New User';
    // this.store.dispatch(AdminActions.fetchUsers());
  }

  onEditUser(user:User){
    this.editingUser=user.username;
    this.editUserForm.patchValue({
      username:user.username,
      email:user.email
    })
  }
  cancelEdit(){
    this.editingUser=null;
  }
  onSubmitEdit(){
    if(this.editUserForm.valid){
      const updatedUser = {...this.editUserForm.value };
      this.store.dispatch(AdminActions.updateUser({ user: updatedUser }));
      this.editingUser=null;
    }
  }
  onDeleteUser(user:User){
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(AdminActions.deleteUser({user}));
        // setTimeout(() => {
          // this.store.dispatch(AdminActions.fetchUsers());
        // },500);
        // this.cdr.detectChanges();
      }
    })
  }

  onSearch(event:Event){
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.cdr.detectChanges()
    this.store.dispatch(AdminActions.fetchUsers());
  }

  initializeForm(){
    this.editUserForm=this.fb.group({
      username:['',[Validators.required,Validators.minLength(4)]],
      email:['',[Validators.required,Validators.email]]
    })
  }

  get filteredUsers$():Observable<User[]>{
    return this.users$.pipe(
      map(users=>users.filter(user=>user.username.toLowerCase().includes(this.searchTerm)))
    )
  }
}

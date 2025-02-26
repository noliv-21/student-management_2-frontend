export interface AuthState {
    user:currentUser | null;
    users:User[];
    role:'admin' | 'user' | null;
    accessToken: string | null;
    error: any;
    loading: boolean;
}
export interface User{
    username:string;
    email:string;
    profileImage:string | undefined;
}
export interface currentUser extends User{
    isAdmin:Boolean;
}
export interface AdminState{
    users: User[],
    error: any;
}
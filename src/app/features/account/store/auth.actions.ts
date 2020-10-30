import { Action } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';
import { UserModel } from "src/app/core/core.model";

export enum AuthActionTypes {
    LOGIN = '[Auth] Login',
    LOGIN_SUCCESS = '[Auth] Login Success',
    LOGIN_ERROR = '[Auth] Login Failure',
    SIGNUP = '[Auth] Signup',
    SIGNUP_SUCCESS = '[Auth] Signup Success',
    SIGNUP_ERROR = '[Auth] Signup Failure',
    LOGOUT = '[Auth] Logout',
    INIT_APP= '[App] Start app initializer',
    INIT_APP_FAIL= '[App] Start app initializer fail',
}

export class AuthStateLoad implements Action {
  readonly type = AuthActionTypes.INIT_APP;
  constructor(public payload: any) {
    console.log('Action AuthStateLoad');
  }
}
export class AuthStateLoadError implements Action {
  readonly type = AuthActionTypes.INIT_APP_FAIL;
  constructor(public payload: any) {
   // console.log('Action AuthStateLoadError');
  }
}

 


export class LogIn implements Action {
    readonly type = AuthActionTypes.LOGIN;
    constructor(public payload: UserModel ) {
       // console.log('Action LogIn'); 
    }
}
 
export class LogInSuccess implements Action {
    readonly type = AuthActionTypes.LOGIN_SUCCESS;
    constructor(public payload: any ) {
       // console.log('Action LogInSuccess');
    }
}

export class LogInError implements Action {
    readonly type = AuthActionTypes.LOGIN_ERROR;
    constructor(public payload: any) {
       // console.log('Action LogInError');
    }
}

export class SignUp implements Action {
    readonly type = AuthActionTypes.SIGNUP;
    constructor(public payload: any) { }
}

export class SignUpSuccess implements Action {
    readonly type = AuthActionTypes.SIGNUP_SUCCESS;
    constructor(public payload: any) {
        console.log('Action SignUpSuccess');
    }
}

export class SignUpError implements Action {
    readonly type = AuthActionTypes.SIGNUP_ERROR;
    constructor(public payload: any) {
       // console.log('Action SignUpError');
    }
}

export class LogOut implements Action {
    readonly type = AuthActionTypes.LOGOUT;
    constructor() {
        //console.log('Action LogOut');
    }
}

 

export type AuthActions = AuthStateLoad | AuthStateLoadError
    | LogIn  
    | LogInSuccess
    | LogInError
    | SignUp
    | SignUpSuccess
    | SignUpError
    | LogOut
 
 


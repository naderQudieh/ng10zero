import { createSelector, createFeatureSelector, ActionReducerMap } from "@ngrx/store";
import * as fromAuth from './auth.reducer';
import * as fromRoot from "src/app/core/app.state"
 
 

 
export interface AuthState {
  auth: fromAuth.AuthState;
}

export const authReducers: ActionReducerMap<AuthState> = {
  auth: fromAuth.authReducer,
};
  
 
export const getAuthState = createFeatureSelector<AuthState>('feature_auth');  
export const selectAuth  = createSelector(getAuthState, state => state.auth); 
export const selectAuthUserInfo = createSelector(getAuthState, state => state.auth.userInfo);
export const selectAuthError = createSelector(getAuthState, state => state.auth.error);
export const selectAuthIsAuthenticated = createSelector(getAuthState, state => state.auth.isAuthenticated);
export const selectIsAuthTokenExpired = createSelector(getAuthState, state => state.auth.isTokenExpired);
 
 
export const getAuthTokenClaims = createSelector(
  selectAuth,
  fromAuth.getAuthClaims
);
export const getValidToken  = createSelector(
  getAuthState,
    (authState: AuthState) => {
        if (authState) {
            if (!authState.auth.isTokenExpired && authState.auth.authToken) {
                return authState.auth.authToken;
            }  
        }   
        return null;
       
    }
);

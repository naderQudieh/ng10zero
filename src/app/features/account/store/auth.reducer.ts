import { UserInfo, AuthToken, AuthModel, UserClaims } from "src/app/core/core.model";
import { AuthActionTypes, AuthActions  } from './auth.actions';
import { log } from 'console';
import { JwtHelperService } from '@auth0/angular-jwt';


export interface AuthState extends AuthModel {
   
} 

export const initialAuthState: AuthState = {
  authToken: getToken(),
  userclaims: getUserClaims(),
  isAuthenticated: getIsAuthenticated(),
  isTokenExpired: getIsTokenExpired(),
  isLoading: false,
  error: null,
};

 

export const authReducer = (state = initialAuthState, action: AuthActions): AuthState => { 
  if (state.authToken) {
    const date = new Date(state.authToken['exp']); 
  } 

    switch (action.type) {
        case AuthActionTypes.LOGIN: {
            return {
                ...state,
                isAuthenticated: false,
                isLoading: true,
                userInfo:null ,
                error: null,
            };
        }
        case AuthActionTypes.LOGIN_SUCCESS: { 
        const authToken =  action.payload;
       
        saveToken(authToken);
            return {
                ...state,
              ...getAuthentication(authToken),
                isLoading: false,
                isAuthenticated: true,
                authToken: action.payload, 
                error: null,
            };
        }
        case AuthActionTypes.LOGIN_ERROR: {
            return {
                ...state,
                authToken:null,
                error: 'Incorrect email or password.',
            };
        }
        case AuthActionTypes.SIGNUP_SUCCESS: {
            return {
                ...state,
                isAuthenticated: false,
                authToken: null,
                error: null,
            };
        }
        case AuthActionTypes.LOGOUT: {
            return {
                ...state,
                isAuthenticated: false,
                authToken: null,
                error: null,
                userclaims: null,
            };
        }
      case AuthActionTypes.INIT_APP: {
        let _state = {
          authToken: getToken(),
          userclaims: getUserClaims(),
          isAuthenticated: getIsAuthenticated(),
          isTokenExpired: false,
          isLoading: false,
          error: null,
        }
        return {
          ...state,
          isAuthenticated: _state.isAuthenticated,
          authToken: _state.authToken,
          userclaims: _state.userclaims, 
          isLoading: false,
          error: null, 
        };
      }
      case AuthActionTypes.INIT_APP_FAIL: {
        return {
          ...state,
          isAuthenticated: false,
          authToken: null,
          error: null,
          userclaims: null,
        };
      }

      default: { 
        return state;
      }
        
    } 
    
}

function saveToken(_token) {
    localStorage.setItem('user_token', JSON.stringify(_token));  
}


function getAuthentication(token: AuthToken): AuthState {
    const jwtHelper = new JwtHelperService();
    if (token == null) {
        return { authToken: null, userclaims: null, error: null };
    } else {
        if (isTokenExpired(token.access_token))
        {
            return { isTokenExpired: true, authToken: null, userclaims: null, error: null };
        } else
        {
            const claims = jwtHelper.decodeToken(token.access_token);
            return { isTokenExpired: false, authToken: token, userclaims: claims, error: null };
        }
    }
}

function isTokenExpired2(token) {
    const jwtHelper = new JwtHelperService(); 
    const claims = jwtHelper.decodeToken(token); 
    if (claims.exp < new Date().getTime() / 1000) {
        destroyToken();
        return true;
    } else {
        return false;
    }
}
function isTokenExpired(token) {
  const jwtHelper = new JwtHelperService();
  let isExpired = jwtHelper.isTokenExpired(token);
  return isExpired; 
}
function getTokenExpirationDate(token: string): Date {
  const jwtHelper = new JwtHelperService(); 
  const decodedToken = jwtHelper.decodeToken(token); 
  if (decodedToken.exp === undefined) { return null; }  
  const date = new Date(0);
  date.setUTCSeconds(decodedToken.exp);
  return date;
}
function destroyToken() {
    localStorage.removeItem('user_token');
}

 
 
export const getAuthClaims = (state: AuthState) => state.userclaims;
export const getAuthToken = (state: AuthState) => state.authToken; 
export const getAccessToken = (state: AuthState) => state.authToken.access_token;




function getIsTokenExpired(): boolean {
  const jwtHelper = new JwtHelperService();
  let token = getToken();
  if (token) {
    return !jwtHelper.isTokenExpired(getToken().access_token);
  }
  return false;
}


function getIsAuthenticated(): boolean { 
  const jwtHelper = new JwtHelperService();
  let token = getToken(); 
  if (token) { 
    return !jwtHelper.isTokenExpired(getToken().access_token);
    }
   return false;
}

function getToken(): AuthToken {
  let token = localStorage.getItem("user_token");
  try {
    return JSON.parse(token)
  } catch (err) {
    return null;
  }
}

 
function getUserClaims(): UserInfo {
  let _claims = null;
  let userclaims = localStorage.getItem("user_claims");
  try {
    _claims = JSON.parse(userclaims);

  }
  catch (err) {
    try {
      let token = getToken();
      if (token) {
        const jwtHelper = new JwtHelperService();
        _claims = jwtHelper.decodeToken(token.access_token) as UserClaims;
      }
    } catch (err) {
      _claims = null;
    }
  }
  return _claims;
}

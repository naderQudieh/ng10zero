import * as AuthReducer from './auth.reducer';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors'; 
import * as AuthEffects from './auth.effects';
import { AuthModel } from "src/app/core/core.model";
import { selectAuth, selectAuthError } from './auth.selectors'; 
export { selectAuth, selectAuthError,  AuthEffects, AuthActions, AuthReducer, AuthSelectors };


import { FormControl, ValidationErrors } from '@angular/forms';

export class Luv2ShopValidatores {

//whiteSpace validation 
static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

//check if only white space 
if((control.value !=null) && (control.value.trim().length ==0)){

    return { 'notOnlyWhiteSpace': true }
}else{
    // mean it's not only space 
    return null;
}
}

}

import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})

export class UserManager {

  constructor(private userService: UserService) {
  }

  getAddresses() {
    return this.userService.getUserAddresses();
  }

  addAddress(data) {
    return this.userService.addAddress(data);
  }

  updateAddress(addressId, data) {
    return this.userService.editAddress(addressId, data);
  }

  deleteAddress(id) {
    return this.userService.deleteAddress(id);
  }
}

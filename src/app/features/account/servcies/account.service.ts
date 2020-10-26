import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { USER_API } from '../../../core/constants/api.constants';

 
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  getProfile() {
    return this.http.get(USER_API.profile);
  }

  updateProfile(data: any) {
    return this.http.put(USER_API.updateProfile, data);
  }

  password(data) {
    return this.http.put(USER_API.updatePassword, data);
  }

  address() {
    return this.http.get(USER_API.address);
  }

  cities() {
    return this.http.get(USER_API.cities);
  }

  addAddress(data) {
    return this.http.post(USER_API.address, data);
  }

  editAddress(id, data) {
    return this.http.put(USER_API.updateAddress + id, data);
  }

  deleteAddress(id) {
    return this.http.delete(USER_API.updateAddress + id);
  }
   
 
}

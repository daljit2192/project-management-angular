import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

declare var $:any;

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	public userDetails = { firstName:"", lastName:"", email:"", password:"", confirmPassword:"", company_name:"" };

	constructor(private _location: Location, private toastr:ToastrService, private router:Router, private _userService:UserService) { }

	/* Function that will send back to previous location */
	public back(){
		this._location.back();
	}

	/* function that will send data in register Api */
	public registerUser(){
		let detailsStatus = this.validateDetails(this.userDetails);
		if(detailsStatus){
			$("body").find(".loading").show();
			this._userService.registerUser(this.userDetails).subscribe(
				response => {
					if(response.status){
						$("body").find(".loading").hide();
						this.toastr.success('Account created successfully. Please Login !!');	
						this.router.navigate(['/login']);
					} else {
						$("body").find(".loading").hide();
						if (typeof response.errors === "object") {
							for (var errorKey in response.errors) {
								this.toastr.error(response.errors[errorKey][0]);	
							}
						}
						else {
							this.toastr.error(response.message);
						}
					}
				},
				error => { console.log(error); }
				);
		}
	}

	/* FUnction that will check for empty values in userDetails */
	validateDetails(userDetails){
		if(this.userDetails.firstName == ""){
			this.toastr.error('Please enter first name');	
		} else if(this.userDetails.lastName == ""){
			this.toastr.error('Please enter last name');	
		} else if(this.userDetails.email == ""){
			this.toastr.error('Please enter email address');	
		} else if(this.userDetails.password == ""){
			this.toastr.error('Please enter password');	
		} else if(this.userDetails.confirmPassword == ""){
			this.toastr.error('Please enter confirm password');	
		} else if(this.userDetails.company_name == ""){
			this.toastr.error('Please enter Company Name');	
		} else {
			if(this.userDetails.confirmPassword !== this.userDetails.password){
				this.toastr.error('Please match your password');	
			} else {
				return true;
				
			}
		}
	}

	ngOnInit() {
	}

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/users/user.service';

declare var $:any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	public loginDetails = {email:"", password:""};

	constructor(private router:Router, private toastr: ToastrService, private _userService:UserService) { 

	}

	login(){
		if(this.loginDetails.email == ""){
			this.toastr.error('Please fill email');	
		} else if(this.loginDetails.password == ""){
			this.toastr.error('Please fill password');	
		} else {
			$("body").find(".loading").show();
			this._userService.loginUser(this.loginDetails).subscribe(
				response => {
					if(response.status){
						localStorage.setItem('_login_token', response._JWTtoken);
						$("body").find(".loading").hide();
						this.toastr.success('Login Successfull');	
						this.router.navigateByUrl('/dashboard');
					} else {
						$("body").find(".loading").hide();
						if (typeof response.errors === "object") {
							for (let errorKey in response.errors) {
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

	ngOnInit() {
	}

}

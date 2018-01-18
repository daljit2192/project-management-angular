import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectService } from '../../services/projects/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

declare var $:any;

@Component({
	selector: 'app-add-project',
	templateUrl: './add-project.component.html',
	styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

	public projectDetails = { name:"", handle:"", status:1, privacy_status:0, users:"" };
	public users = [];

	constructor(private _userService:UserService, private router:Router, private _location:Location, private _projectService:ProjectService, private toastr:ToastrService) { 
		this._userService.getAllUsers().subscribe(
			response=>{
				this.users = response.users;

			},
			error=>{},
		);
	}

	ngOnInit() {
	}

	ngAfterViewInit(){
		$("select[name='assignees']").select2({
			placeholder:"Select Assignees"
		});
	}

	/* Function that will send back to previous location */
	public back(){
		this._location.back();
	}

	public validateHandle(){
		if(this.projectDetails.handle!==""){
			this.projectDetails.handle = this.projectDetails.handle.toLowerCase();
			this.projectDetails.handle = this.projectDetails.handle.replace(" ","-");
		}
	}

	public getProjectHandle(){
		if(this.projectDetails.name == ""){
			return false;
		}
		$(".loading").css("display","block");
		
		/* project service function that will get handle for project from backend */
		this._projectService.getProjecthandle(this.projectDetails.name).subscribe(
			response => {
				if(response.status){
					$(".loading").css("display","none");
					this.projectDetails.handle = response.handle;
				} else {
					
				}
			},
			error => { console.log(error); }
		);
	}

	/* Function that will add new project in database */
	public addProject(){
		let detailsStatus = this.validateDetails();

		this.projectDetails.privacy_status = parseInt($("input[name='optradio']:checked").val());

		if($("select[name='assignees']").val()!== null && $("select[name='assignees']").val()!==""){
			this.projectDetails.users = $("select[name='assignees']").val().join(",");
		}
		if(detailsStatus){
			$("body").find(".loading").show();
			
			/* project service function that will create new project in database */
			this._projectService.addProject(this.projectDetails).subscribe(
				response => {
					if(response.status){
						$("body").find(".loading").hide();
						this.toastr.success(response.message);	
						this.router.navigate(['/dashboard/projects']);
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

	/* Function that will check for empty values in userDetails */
	validateDetails(){
		if(this.projectDetails.name == ""){
			this.toastr.error('Please enter project name.');	
		} else if(this.projectDetails.handle == ""){
			this.toastr.error('Please enter project handle.');	
		} else {
			return true;
		}
	}

}

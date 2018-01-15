import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectService } from '../../services/projects/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var $:any;

@Component({
	selector: 'app-add-project',
	templateUrl: './add-project.component.html',
	styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

	public projectDetails = { name:"", handle:"", status:0 };

	constructor(private router:Router, private _location:Location, private _projectService:ProjectService, private toastr:ToastrService) { }

	ngOnInit() {
	}

	/* Function that will send back to previous location */
	public back(){
		this._location.back();
	}

	/* Function that will add new project in database */
	public addProject(){
		let detailsStatus = this.validateDetails();
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

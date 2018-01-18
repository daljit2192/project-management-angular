import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectService } from '../../services/projects/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

declare var $:any;

@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

	public projectDetails = {id:0, name:"", handle:"", status:1, privacy_status:0, users:"" };
	public users = [];
	public projectAssignees = [];
	public statuses = [];

	constructor(private _userService:UserService, private router:Router, private _location:Location, private _projectService:ProjectService, private toastr:ToastrService) { 
		this.getAllUsers();
		this.getProjectByHandle();
		this.getStatus();
	}

	ngAfterViewInit(){
		$("select[name='assignees']").select2({
			placeholder:"Select Assignees"
		})
	}

	ngOnInit() {
	}

	public getProjectByHandle(){
		this._projectService.getSingleProject(this.router.url.split("/")[4]).subscribe(
			response=>{
				if(response.status){
					this.projectDetails.id = response.project.id;
					this.projectDetails.name = response.project.name;
					this.projectDetails.handle = response.project.handle;
					this.projectDetails.status = response.project.status;
					this.projectDetails.privacy_status = response.project.privacy_status;
					this.setAssignees(response.project.assignees);
				} else {
					this.router.navigate(["/dashboard/projects"]);
				}
			},
			error=>{},
		);
	}

	public getStatus(){
		this._projectService.getAllStatuses().subscribe(
			response=>{
				if(response.status){
					this.statuses = response.statuses;
				} else {
					this.router.navigate(["/dashboard/projects"]);
				}
			},
			error=>{},
		);
	}

	/* Function that will send back to previous location */
	public back(){
		this._location.back();
	}

	public setAssignees(assignees){
		for(let assignee in assignees){
			this.projectAssignees.push(assignees[assignee].user_id)
		}
		$("select[name='assignees']").val(this.projectAssignees).trigger("change");
	}

	public getAllUsers(){
		this._userService.getAllUsers().subscribe(
			response=>{
				this.users = response.users;

			},
			error=>{},
		);
	}

	public updateProject(){
		let detailsStatus = this.validateDetails();
		if(!detailsStatus){
			return false;
		}
		this.projectDetails.privacy_status = parseInt($("input[name='optradio']:checked").val());

		if($("select[name='assignees']").val()!== null && $("select[name='assignees']").val()!==""){
			this.projectDetails.users = $("select[name='assignees']").val().join(",");
		}

		this._projectService.updateProject(this.projectDetails).subscribe(
			response=>{
				if(response.status){
					this.toastr.success(response.message);
					this.router.navigate(["/dashboard/projects"]);
				} else {
					this.toastr.error(response.message);
				}
			},
			error=>{},
		);	
	}

	/* Function that will check for empty values in userDetails */
	public validateDetails(){
		if(this.projectDetails.name == ""){
			this.toastr.error('Please enter project name.');	
		} else if(this.projectDetails.handle == ""){
			this.toastr.error('Project handle cannot be empty.');	
		} else if(this.projectDetails.status == 0){
			this.toastr.error('Select valid status of project.');	
		} else {
			return true;
		}
	}

	public validateHandle(){
		if(this.projectDetails.handle!==""){
			this.projectDetails.handle = this.projectDetails.handle.toLowerCase();
			this.projectDetails.handle = this.projectDetails.handle.replace(" ","-");
		}
	}

}

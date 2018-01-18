import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectService } from '../../services/projects/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';

declare let $:any;

@Component({
	selector: 'app-project-list',
	templateUrl: './project-list.component.html',
	styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

	public projects = [];
	public projectDetails:boolean;
	public noProjectFound:boolean;
	public currentProjectHandle:string;
	constructor(private toastr:ToastrService, private _projectService:ProjectService, private router:Router) {
		$(".loading").css("display","block");
		this._projectService.getAllProjects().subscribe(
			response=>{
				if(response.status){
					$(".loading").css("display","none");
					this.projectDetails = true;
					this.projects = response.projects;
				} else {
					$(".loading").css("display","none");
					this.projectDetails = false;
					this.noProjectFound = true;
				}
			},
			error=>{

			},
		);
	}

	ngOnInit() {}

	public deleteProject(){
		$(".loading").css("display","block");
		this._projectService.deleteProject(this.currentProjectHandle).subscribe(
			response=>{
				if(response.status){
					$(".loading").css("display","none");
					this.toastr.success(response.message);
					$("table").find("."+this.currentProjectHandle).remove();
				} else {
					this.toastr.error(response.message);
				}
			},
			error=>{

			},
		)
	}

}

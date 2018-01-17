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
	public projectDetails:boolean = false;
	constructor(private _projectService:ProjectService) {
		$(".loading").css("display","block");
		this._projectService.getAllProjects().subscribe(
			response=>{
				$(".loading").css("display","none");
				this.projectDetails = true;
				this.projects = response.projects;
			},
			error=>{

			},
		)
	}

	ngOnInit() {
	}

}

import { Component, OnInit, AfterViewInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ProjectService } from '../../services/projects/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/user.service';
import { TaskService } from '../../services/tasks/task.service';
import { TaskSharedService } from '../../services/tasks/task.shared';
import { NgProgressService } from 'ngx-progressbar';
import { DatePipe } from '@angular/common';
import { PriorityFilterPipe } from '../../pipes/priority.filter.pipe';
import { NameFilterPipe } from '../../pipes/name.filter.pipe';

declare var $:any;

@Component({
	selector: 'app-view-project',
	templateUrl: './view-project.component.html',
	styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

	@Output()
	public singleTask:any;
	
	public projectDetails = {id:0, name:"", handle:"", status:1, statusValue:"", privacy_status:0, description:"", users:"", created_by:"" };
	public users = [];
	public projectAssignees = [];
	public statuses = [];
	public projectDetailsStatus:boolean = false;
	public showSidebar:boolean = false;
	public viewProjectStatus:boolean = false;
	public viewTaskStatus:boolean = true;
	public noTaskFound:boolean = true;
	public taskDetails = { name:"", description:"", tags:"", created_by:"",created_at:"", project_id:0, status:1, priority:1,priority_value:"",users:"", statuses:{} };
	public tasks = [];
	public priorities = [];
	public searchTask:any;	
	public priorityFilter:any;	

	constructor(private _taskService:TaskService, private _taskSharedService:TaskSharedService, private _progressService:NgProgressService, private _userService:UserService, private router:Router, private _location:Location, private _projectService:ProjectService, private toastr:ToastrService) { 
		this.getAllUsers();
		this.getProjectByHandle();
		this.getStatus();
		this.getPriority();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		$(".add_task_tags").tagsinput({
			width:"100%",
		});
		$("#description").Editor({
			status_bar:false, 'block_quote':false,ol:false, ul:false, undo:false, redo:false, hr_line:false, strikeout:false, source:false, rm_format:false, print:false, splchars:false, togglescreen:false, select_all:false, indent:false, outdent:false, insert_table:false, insert_link:false, unlink:false, insert_img:false
		});
		$(".comments").Editor({
			status_bar:false, 'block_quote':false,ol:false, ul:false, undo:false, redo:false, hr_line:false, strikeout:false, source:false, rm_format:false, print:false, splchars:false, togglescreen:false, select_all:false, indent:false, outdent:false, insert_table:false, insert_link:false, unlink:false, insert_img:false
		});
		$("select[name='assignees']").select2({
			tags: false,
			theme: "bootstrap",
			width:"82.7%"
		});
	}

	public getProjectByHandle(){
		this._progressService.start();
		this._projectService.getSingleProject(this.router.url.split("/")[4]).subscribe(
			response=>{
				if(response.status){
					this.setProjectDetails(response);
				} else {
					this.router.navigate(["/dashboard/projects"]);
				}
				this.getTasks();
			},
			error=>{
				let self = this;
				if (error.status === 401) {
					this.toastr.error("Login Session expired");
					localStorage.clear();
					setTimeout(function () {
						self.router.navigateByUrl("login");
					}, 2000);
				}
			},
			);
	}

	public setProjectDetails(response:any){
		this.projectDetails.id = response.project.id;
		this.projectDetails.name = response.project.name;
		this.projectDetails.handle = response.project.handle;
		this.projectDetails.status = response.project.status;
		this.projectDetails.statusValue = response.project.statuses[0].name;
		this.projectDetails.privacy_status = response.project.privacy_status;
		this.projectDetails.description = response.project.description;
		this.projectDetails.created_by = response.project.user[0].first_name+ " "+ response.project.user[0].last_name;
		$("body").find("._project_description").append(this.projectDetails.description);
		this.projectAssignees = response.project.assignees;
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
			error=>{
				let self = this;
				if (error.status === 401) {
					this.toastr.error("Login Session expired");
					localStorage.clear();
					setTimeout(function () {
						self.router.navigateByUrl("login");
					}, 2000);
				}
			},
			);
	}

	public getPriority(){
		this._taskService.getPriority().subscribe(
			response => {
				if(response.status){
					this.priorities = response.priorities;
				}
			},
			error => {}
			)
	}

	public getTasks(){
		this._taskService.getTasks(this.projectDetails.id).subscribe(
			response=>{
				this.projectDetailsStatus = true;
				if(response.status){
					this.tasks = response.tasks;
					this._progressService.done();
					this.viewProjectStatus = true;
				} else {
					this.noTaskFound = true;
				}
			},
			error=>{}
			);
	}

	public getAllUsers(){
		this._userService.getAllUsers().subscribe(
			response=>{
				this.users = response.users;

			},
			error=>{
				let self = this;
				if (error.status === 401) {
					this.toastr.error("Login Session expired");
					localStorage.clear();
					setTimeout(function () {
						self.router.navigateByUrl("login");
					}, 2000);
				}
			},
			);
	}

	public saveTask(){
		if(this.taskDetails.name==""){
			this.toastr.error("Please fill name of task");
		} else {
			this.taskDetails.description = $("#description").closest("div").find(".Editor-container .Editor-editor").html();
			this.taskDetails.tags = $("#taskTags").val();
			this.taskDetails.project_id = this.projectDetails.id;
			if ($("select[name='assignees']").val() !== null){
	            this.taskDetails.users = $("select[name='assignees']").val().join(",");
			}

			this._taskService.addTask(this.taskDetails).subscribe(
				response=>{
					if(response.status){
						this.tasks.push(response.tasks);
						this.toastr.success(response.message);
						$("#deleteModal").modal("hide");
					}
				},
				error=>{}
				);
		}
	}

	public getTaskDetails(taskId){
		this.viewTaskStatus = false;
		this.showSidebar = !this.showSidebar;
		this._taskService.getSingleTask(taskId).subscribe(
			response=>{
				if(response.status){
					this._taskSharedService.set_task(JSON.stringify(response.task));
					this.viewTaskStatus = true;
					this.taskDetails.name = response.task[0].name;
					this.taskDetails.created_by = response.task[0].user.full_name;
					this.taskDetails.created_at = response.task[0].created_at;
					this.taskDetails.priority_value = response.task[0].priority[0].name;
				}
			},
			error=>{}
			);
	}

}

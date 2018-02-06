import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { TaskSharedService } from '../services/tasks/task.shared';

declare var $:any;

@Component({
	selector: 'app-comments',
	templateUrl: './comments.component.html',
	styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

	public singleTask:any;

	constructor(private _taskSharedService:TaskSharedService) { 
		
		this._taskSharedService.get_task().subscribe(
			task=> {
				this.singleTask = JSON.parse(task);
			}
			);
	}

	ngOnInit() {
		if($(".sidenav").find(".Editor-container").length == 0){
			$(".comments").Editor({
				status_bar:false, 'block_quote':false,ol:false, ul:false, undo:false, redo:false, hr_line:false, strikeout:false, source:false, rm_format:false, print:false, splchars:false, togglescreen:false, select_all:false, indent:false, outdent:false, insert_table:false, insert_link:false, unlink:false, insert_img:false
			});
		}
	}

}

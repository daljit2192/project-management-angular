import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	constructor() { 

	}

	logout(){
		localStorage.clear();
		window.location.reload();
	}

	toggleChildLi($event){
		$($event.target).closest("li").find("._child_ul").slideToggle();
	}

	ngOnInit() {
		
	}

}

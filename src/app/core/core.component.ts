import { CommonModule, AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'rentcar-homepage',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
    imports: [RouterOutlet,CommonModule, FormsModule, AsyncPipe]
})
export class CoreComponent implements OnInit, AfterViewInit {
  constructor(@Inject(AuthService) public auth: AuthService,public router:Router) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}

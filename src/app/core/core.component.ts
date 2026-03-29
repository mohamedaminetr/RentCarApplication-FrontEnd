import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'rentcar-homepage',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
    imports: [RouterOutlet]
})
export class CoreComponent implements OnInit, AfterViewInit {
  constructor() {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}

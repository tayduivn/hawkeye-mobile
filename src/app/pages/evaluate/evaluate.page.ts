import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.page.html',
  styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage implements OnInit {
  list: any[] = []
  constructor(private router: Router) { }

  ngOnInit() {
  }

}

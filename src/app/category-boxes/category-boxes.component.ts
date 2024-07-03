import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-boxes',
  templateUrl: './category-boxes.component.html',
  styleUrls: ['./category-boxes.component.css']
})
export class CategoryBoxesComponent implements OnInit {
  @Input() categories: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }
}

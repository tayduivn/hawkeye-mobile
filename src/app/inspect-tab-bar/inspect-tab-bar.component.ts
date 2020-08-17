import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inspect-tab-bar',
  templateUrl: './inspect-tab-bar.component.html',
  styleUrls: ['./inspect-tab-bar.component.scss'],
})
export class InspectTabBarComponent implements OnInit {

  @Output() onSelect: EventEmitter<string> = new EventEmitter();
  current: 'before'|'after'|'require' = 'before';
  constructor() { }

  ngOnInit() {}

  select(s: 'before'|'after'|'require'){
    this.current = s;
    this.onSelect.emit(s);
    
  }

}

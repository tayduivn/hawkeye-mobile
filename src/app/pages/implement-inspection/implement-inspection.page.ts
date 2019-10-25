import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from "@angular/core";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { InspectionService } from 'src/app/services/inspection.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: "app-implement-inspection",
  templateUrl: "./implement-inspection.page.html",
  styleUrls: ["./implement-inspection.page.scss"],
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          opacity: 1,
          right: 0
        })
      ),
      state(
        "closed",
        style({
          opacity: 0,
          right: "100%"
        })
      ),
      state(
        "back",
        style({
          opacity: 0,
          right: "-100%"
        })
      ),
      transition("open => closed", [animate("0.3s ease-in-out")]),
      transition("back => open", [animate("0.3s ease-out")]),
      transition("open => back", [animate("0.3s ease-in-out")]),
      transition("closed => open", [animate("0.3s ease-out")])
    ])
  ]
})
export class ImplementInspectionPage implements OnInit {
  active:string = "factory"
  inspectTask:Observable<any[]>
  task:any[] = []
  factory:number|string = ''
  contract:number|string = ''
  contractList:any[] = []
  constructor(private inspectService:InspectionService,private storage:StorageService,private router:Router) {}

  ngOnInit() {
  }

  toInspect(){
    this.router.navigate(['/inspect-factory',this.contract])
  }
  
  ionViewWillEnter(){
    this.inspectTask =  this.inspectService.getInspectTaskList()
    this.inspectTask.subscribe(res=>{
      this.task = res
      this.storage.set('IMPLEMENT-INSPECTION-META-DATA',res)
    }) 
  
  }
  
  get apply_id():number{
    if(!this.task.length) return
    let rVal:number
    this.task.forEach(res => {
          res.forEach(task => {
              task.contract.id == this.factory && (rVal = task.id)
          })
        })  
    return rVal
  }
}

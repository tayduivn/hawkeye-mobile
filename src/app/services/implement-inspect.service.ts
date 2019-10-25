import { PoModal } from './../pages/implement-inspection/inspect-po/inspect-po.component';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { FactoryModel } from '../pages/implement-inspection/inspect-factory/inspect-factory.component';

export interface InspectFactoryParam{
  factory_data?:FactoryModel
  apply_inspection_no:string
  contract_data?:PoModal
}

@Injectable({
  providedIn: 'root'
})
export class ImplementInspectService {

  constructor(private http:HttpService) { }

  inspectFactory(params:InspectFactoryParam){
    return this.http.post({url:'/task/task-inspection-post',params:params})
  }

  getInspectData(no:string){
    return this.http.get({url:'/task/get_inspection_task_posted_data',params:{apply_inspection_no:no}})
  }
}

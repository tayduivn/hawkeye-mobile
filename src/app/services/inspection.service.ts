import { HttpService } from "./http.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ModalOptions } from "@ionic/core";
import { InspectSettingBoxComponent } from "../widget/inspect-setting-box/inspect-setting-box.component";

export interface InspectGroup {
  apply_inspections: any[]; //申请数据
  created_at: string;
  desc: string;
  id: number;
  info: any[];
  inspection_group_no: string;
  inspection_group_user: any[]; //验货人
  name: string;
  updated_at: string;
  user: string[];
  user_can_change: number;
  user_id: number[]; //
  expand: boolean;
  probable_inspection_date_range?: any;
}

export interface contractsResponse {
  data: any;
  message: string;
  status: number;
}

export interface inspectParams {
  id?: number;
  sku?: string;
  task_id?: number;
  contract_id: number;
}

@Injectable({
  providedIn: "root"
})
export class InspectionService {
  constructor(private http: HttpService) {}

  getTaskList(): Observable<InspectGroup[]> {
    return this.http.get({ url: "/inspection/get_inspection_task_data" });
  }

  inspectSetting(params: any): Observable<any> {
    return this.http.post({
      url: "/inspection/pre_inspection_task",
      params: params
    });
  }

  getInspectTaskList(): Observable<any> {
    return this.http.get({ url: "/task/inspection_task_list" });
  }

  toInspection(params: inspectParams): Observable<contractsResponse> {
    //验货  （sku）
    return this.http.get({
      url: "/task/task-sku-view",
      params: {
        task_id: params.id,
        sku: params.sku,
        contract_id: params.contract_id
      }
    });
  }

  addInspectionTaskDesc(params: {
    sku?: string;
    inspection_task_desc?: string;
    apply_id?: number;
    is_know_demand?:any;
    is_inspected_product?:any;
    require_data_advise?:{
  	  index?:number,
  	  unreasonable_inspection_task_advise?:string,
  	  improve_inspection_task_advise?:string
    }
  }) {
    return this.http.post({
      url: "/inspection/add_inspection_task_desc",
      params: params
    });
  }

  getInspectTaskById(apply_id: number) {
    return this.http.get({
      url: "/inspection/get_inspection_for_apply_id",
      params: { apply_id: apply_id }
    });
  }

  
  submitData(uploadData: uploadData): Observable<any> {
    //sku  提交
    return this.http.post({
      url: "/task/task-inspection-post",
      params: uploadData
    });
  }

  
  submitDataAcc(accUpload: Array<accessOfTaskAndFac>): Observable<any> {
    return this.http.post({
      url: "/task/task-inspection-acc-post",
      params: accUpload
    });
  }
}


export interface uploadData {
  type?: string;
  contract_id: number | string;
  data?: project;
  sku?: string;
  task_id: string | number;
  parentSku?: string;
}


export interface project {
  sku_sys: sku_sys,
  sku_other?: Array<sku_other>,
  sku_acc?: Array<any>
}

export interface sku_other{
  InspectionRequiremen?:string   //验证内容
  IsNeedPic?:string    //是否需要拍照
  is_standard?:number    //是否通过
  remark?:string      //失败原因
  description?:string    //描述
  pic:Array<string>
}

export interface sku_sys {
  BarCode?: string,
  contract_id?:number,
  ChineseDescription?: string,
  ChineseName?: string,
  Count?: number,
  DetailCount?: number,
  net_weight?:number,
  NetWeight?: number,
  OutsideBarCode?: string,
  outside_bar_code?:string,
  PackingSizeHight?: number,
  PackingSizeLength?: number,
  PackingSizeWidth?: number,
  PackingTypestring?: string,
  PackingWeight?: number,
  ProductCode?: string,
  ProductSizeHeight?: string,
  ProductSizeLength?: string,
  ProductSizeWidth?: string,
  RateContainer?: string,
  RoughWeight?: number,
  SinglePacking?: number,
  SinglePackingSizeHight?: number,
  SinglePackingSizeLength?: number,
  SinglePackingSizeWidth?: number,
  TextTure?: string,
  quantity?:number,
  rate_container?:number,
  rough_weight?:number,
  packing_size?:Array<string|number>
  pic?: Array<string>
}

export interface accessOfTaskAndFac {
  contract_id: number
  task_id: string | number
  data: Array<access>
}

export interface access {
  contract_id: number
  AccessoryCode: string
  AccessoryName: string
  BarCode: string
  ChineseDescription: string
  PackingType: string
  ProductCode: string
  StockDetailNum: number
}
import { environment } from './../../../../environments/environment';
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { ScanComponent } from "./../../../widget/scan/scan.component";
import { PageEffectService } from "src/app/services/page-effect.service";
import { Component, OnInit } from "@angular/core";
import { Sku } from "src/app/widget/sku-info/sku-info.component";
import { StorageService } from "src/app/services/storage.service";

const sku: any = {
  Brand: null,
  accessory: true,
  complete: "",
  container_num: 200,
  description: null,
  group: null,
  has_strap: null,
  isNew: null,
  is_inspected_product: 0,
  is_know_demand: 1,
  is_need_drop_test: null,
  is_need_sample: null,
  news_or_return_product: null,
  other_data: false,
  photo: [],
  pic: ["/UploadFiles/Product/9c58f9d1-ab96-4671-b667-2be847522664.jpg"],
  quantity: 15,
  rate_container: 1,
  require_data_advise: [null, null],
  return_rate: " 5",
  sku: "CW12X0286",
  sku_chinese_name: "原木色宠物床--不带顶",
  chinese_description:
    // tslint:disable-next-line: max-line-length
    "360度折叠游戏椅，颜色：橘红色，最大承重：100kg。产品尺寸：129*58*12cm ，展开尺寸为101.3*60.3*76cm，折叠尺寸为72.9*60.3*38.6cm。 钢管：19*1.0mm，面料：仿麻布，底部是聚酯布，海绵为普通海绵+再生棉。 调节器：koyo2+5（日本）。带转盘，可360度旋转。",
  packing_type:
    // tslint:disable-next-line: max-line-length
    "各块木板（每块板贴上与说明书相对应的标贴）之间用珍珠棉隔开，然后整体包裹气泡膜，并用胶带封住。螺丝及木榫分类放入自封袋（每个自封袋上贴上与说明书对应的标贴）中，再共入一个黄色气泡信封袋，且将其与气泡膜粘住。最后上述物品同英文说明书共入一个五层双瓦楞加强纸箱，纸箱六面用0.5cm泡沫保护。纸箱的所有开口处请用透明胶带封牢。纸箱六面印刷我司指定唛头，备注：封箱胶带不要起皱，纸箱不能鼓起。条形码为***，条形码需能清晰可扫。"
};

export interface SkuInspectModel {
  spotCheckNum: number; // 抽检数量
  poNo: string; // PO
  shippingMarks: InspectItem; // 唛头
  size: Box; // 尺寸
  barCode: InspectItem; // 条码
  grossWeight: InspectItem; // 毛重
  throwBox: InspectItem; // 摔箱测试
  packing: InspectItem; // 包装
  layout: InspectItem; // 摆放图
  productDetail: InspectItem; //产品细节图
  instructions: InspectItem; // 说明书
  crews: InspectItem; //螺丝包
  whole: InspectItem; // 组装后整体
  productSize: Box; // 产品尺寸
  netWeight: InspectItem; // 净重
  function: InspectItem; // 功能测试
  bearing: InspectItem; // 承重
  waterContent: InspectItem; // 含水量测试
  parts: Parts; // 配件
  sumUp: InspectItem   //总结
  desc: InspectItem   //备注
}

export interface Box {
  length: string; // 长
  width: string; // 宽
  height: string; // 高
  desc?: string[]; // 备注
  photos?: string[]; // 照片
  videos?: string[]; // 视频
}

export interface Parts {
  no: string;
  name?: string;
  inspect: InspectItem;
  desc?: string[];
}

export interface InspectItem {
  text?: string;
  desc?: string[];
  photos?: string[];
  videos?: string[];
}

export const ToggleItem: any = [
  {
    key: "beforeUnpacking",
    value: "开箱前"
  },
  {
    key: "afterUnpacking",
    value: "开箱后"
  },
  {
    key: "requirement",
    value: "验货要求"
  }
];

@Component({
  selector: "app-inspect-sku",
  templateUrl: "./inspect-sku.component.html",
  styleUrls: ["./inspect-sku.component.scss"]
})
export class InspectSkuComponent implements OnInit {
  data: Sku = null;
  factory: any = null;
  barCode: string = null;
  rateStatus: "out" | "inner" = "inner";
  toggleItem: any[] = ToggleItem;
  currentToggle: any = ToggleItem[0];
  imgOrigin:string = environment.fileUrlPath

  constructor(
    private es: PageEffectService,
    private fb: FormBuilder,
    private storage: StorageService
  ) {}

  SkuInspectModel: FormGroup = this.fb.group({
    spotCheckNum: this.fb.control(""),
    poNo: this.fb.control(""),
    inner_box_data: this.fb.group({
      shippingMarks: this.fb.array([]),
      size: this.fb.group({
        photo: this.fb.array([]),
        length: this.fb.control(""),
        width: this.fb.control(""),
        height: this.fb.control("")
      }),
      barCode: this.fb.control(""),
      grossWeight: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([])
      }),
      throwBox: this.fb.group({
        photo: this.fb.array([]),
        video: this.fb.array([]),
        isPass: this.fb.control(""),
        desc: this.fb.array([])
      }),
      packing: this.fb.group({
        photo: this.fb.array([]),
        isTrue: this.fb.control(""),
        desc: this.fb.array([])
      }),
      layout: this.fb.array([]),
      productDetail:this.fb.group({
        photo: this.fb.array([]),
        desc: this.fb.array([])
      }),
      instructions: this.fb.array([]),
      crews: this.fb.group({
        photo: this.fb.array([]),
        isTrue: this.fb.control(""),
        desc: this.fb.array([])
      }),
      whole: this.fb.array([]),
      productSize: this.fb.group({
        photo: this.fb.array([]),
        length: this.fb.control(""),
        width: this.fb.control(""),
        height: this.fb.control("")
      }),
      netWeight: this.fb.group({
        textOne: this.fb.control(""),
        textTwo: this.fb.control(""),
        photo: this.fb.array([])
      }),
      function: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([]),
        video: this.fb.array([]),
        desc: this.fb.array([])
      }),
      bearing: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([]),
        video: this.fb.array([]),
        desc: this.fb.array([])
      }),
      waterContent: this.fb.group({
        // 含水量测试
        text: this.fb.control(""),
        photo: this.fb.array([]),
        video: this.fb.array([]),
        desc: this.fb.array([])
      }),
      sumUp:this.fb.group({
        textOne:this.fb.control(''),
        textTwo:this.fb.control(''),
      }),
      desc: this.fb.array([])
    }),
    outer_box_data: this.fb.group({
      shippingMarks: this.fb.group({
        photo: this.fb.array([])
      }),
      barCode: this.fb.control(""),
      grossWeight: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([])
      }),
      packing: this.fb.group({
        photo: this.fb.array([]),
        isTrue: this.fb.control(""),
        desc: this.fb.array([])
      }),
      netWeight: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([])
      }),
      function: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([]),
        video: this.fb.array([]),
        desc: this.fb.array([])
      }),
      bearing: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([]),
        video: this.fb.array([]),
        desc: this.fb.array([])
      }),
      waterContent: this.fb.group({
        text: this.fb.control(""),
        photo: this.fb.array([]),
        video: this.fb.array([]),
        desc: this.fb.array([])
      }),
      desc: this.fb.array([])
    })
  });

  ngOnInit() {
    this.data = this.storage.get("CURRENT_IMPLEMENT_SKU");
    this.factory = this.storage.get("CURRENT_FACTORY_DATA");
    console.log(this.factory);
    this.rateStatus = this.data.rate_container > 1 ? "out" : "inner";
  }

  scan() {
    const modal = this.es.showModal(
      {
        component: ScanComponent
      },
      res => {
        console.log(res);
        this.barCode = res.value;
      }
    );
  }

  descEnter(e: string[], type: string, box: "inner" | "outer") {
    // console.log((this.SkuInspectModel.get(box+'_box_data')).get(type));
    // (((this.SkuInspectModel.get(box+'_box_data') ).get(type) as FormGroup).get('desc') as FormArray)
    //   .setValue(e)
  }

  toggleBoxRate() {}

  save() {
    this.es.showAlert({
      message: "正在上传……"
    });
  }

  setPhoto(e: any[], type: string) {
    if (e && e.length) {
      (this.SkuInspectModel.get(type) as FormArray).clear();
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < e.length; i++) {
        (this.SkuInspectModel.get(type) as FormArray).push(new FormControl(""));
      }
    } else {
      (this.SkuInspectModel.get(type) as FormArray).clear();
    }
    (this.SkuInspectModel.get(type) as FormArray).setValue(e);
  }

  videoOver(e: any, type: string) {}

  segmentChanged(ev: any) {
    this.currentToggle = this.toggleItem.find(
      res => res.key == ev.detail.value
    );
    console.log("Segment changed", ev);
  }
}

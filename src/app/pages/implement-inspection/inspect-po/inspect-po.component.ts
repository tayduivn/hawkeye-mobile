import { PageEffectService } from "src/app/services/page-effect.service";
import { Component, OnInit } from "@angular/core";
import { Contract, Sku } from "src/app/widget/sku-info/sku-info.component";
import { StorageService } from "src/app/services/storage.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  ImplementInspectService,
  InspectFactoryParam
} from "src/app/services/implement-inspect.service";

const data: any = {
  factoryName: "临沂市金硕家具用品有限公司",
  factoryId: 42,
  contracts: [
    {
      manufacturer: "临沂市金硕家具用品有限公司",
      no: "YH-201901280070",
      skuList: [
        {
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
          pic: [
            "/UploadFiles/Product/9c58f9d1-ab96-4671-b667-2be847522664.jpg"
          ],
          quantity: 15,
          rate_container: "1",
          require_data_advise: [null, null],
          return_rate: 5,
          sku: "CW12X0286",
          sku_chinese_name: "原木色宠物床--不带顶"
        },
        {
          Brand: "JAXPETY",
          accessory: false,
          complete: "产品生产完成，包装完成30%以下",
          container_num: 156,
          description: "sadasdads",
          group: "A",
          has_strap: "1",
          isNew: null,
          is_inspected_product: 0,
          is_know_demand: 1,
          is_need_drop_test: "1",
          is_need_sample: "1",
          logo_desc: "asdasd131",
          must_quantity: 9,
          news_or_return_product: "news",
          other_data: true,
          photo: [
            "apply_inspection/226_CW12F0273-12_0.gif",
            "apply_inspection/226_CW12F0273-12_1.gif"
          ],
          pic: [
            "/UploadFiles/Product/a7eafb1e-793c-4674-b2e5-449a5f6676a5.jpg"
          ],
          quantity: 12,
          rate_container: "1",
          require_data_advise: [],
          return_rate: 5,
          sku: "CW12F0273-12",
          sku_chinese_name: "大号带顶棚狗笼"
        }
      ]
    },
    {
      manufacturer: "临沂市金硕家具用品有限公司",
      no: "YH-201901280075",
      skuList: [
        {
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
          pic: [
            "/UploadFiles/Product/9c58f9d1-ab96-4671-b667-2be847522664.jpg"
          ],
          quantity: 15,
          rate_container: "1",
          require_data_advise: [null, null],
          return_rate: 5,
          sku: "CW12X0286",
          sku_chinese_name: "原木色宠物床--不带顶"
        },
        {
          Brand: "JAXPETY",
          accessory: false,
          complete: "产品生产完成，包装完成30%以下",
          container_num: 156,
          description: "sadasdads",
          group: "A",
          has_strap: "1",
          isNew: null,
          is_inspected_product: 0,
          is_know_demand: 1,
          is_need_drop_test: "1",
          is_need_sample: "1",
          logo_desc: "asdasd131",
          must_quantity: 9,
          news_or_return_product: "news",
          other_data: true,
          photo: [
            "apply_inspection/226_CW12F0273-12_0.gif",
            "apply_inspection/226_CW12F0273-12_1.gif"
          ],
          pic: [
            "/UploadFiles/Product/a7eafb1e-793c-4674-b2e5-449a5f6676a5.jpg"
          ],
          quantity: 12,
          rate_container: "1",
          require_data_advise: [],
          return_rate: 5,
          sku: "CW12F0273-12",
          sku_chinese_name: "大号带顶棚狗笼"
        }
      ]
    }
  ]
};

export interface Factory {
  name: string;
  id: number;
  contracts: Contract[];
}

export interface PoModal {
  contract_no: string; //合同号
  inspection_complete_num: number; //大货包装数量
  contract_sku_desc: SkuOFPoModal;
}

export interface SkuOFPoModal {
  contract_sku_num: number; //验货数量
  photo: string[]; //照片
  sku: string; //sku
  sku_complete_num: number; //大货生产完成数量
}

@Component({
  selector: "app-inspect-po",
  templateUrl: "./inspect-po.component.html",
  styleUrls: ["./inspect-po.component.scss"]
})
export class InspectPoComponent implements OnInit {
  imgOrigin: string = environment.fileUrlPath;
  metaData: any[];
  apply_inspect_no: string = "";
  data: any = {
    contract: {
      manufacturer: ""
    }
  };
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };
  constructor(
    private storage: StorageService,
    private activeRouter: ActivatedRoute,
    private camera: Camera,
    private ec: PageEffectService,
    private implementInspect: ImplementInspectService,
    private router: Router
  ) {}
  ngOnInit() {
    this.metaData = this.storage.get("IMPLEMENT-INSPECTION-META-DATA");
    this.activeRouter.params.subscribe(params => {
      this.apply_inspect_no = params.fid;
      this.data = this.metaData.find(
        elem => elem.sku_data[0].apply_inspection_no == params.fid
      );

      this.implementInspect
        .getInspectData(this.apply_inspect_no)
        .subscribe(res => {
          this.data.sku_data[0].contract_data.forEach(item => {
            res.contract_data &&
              res.contract_data.forEach(sItem => {
                if (item.contract_no == sItem.contract_no) {
                  item.inspection_complete_num = sItem.inspection_complete_num;

                  item.data.forEach(sku => {
                    if (sku.sku == sItem.contract_sku_desc.sku) {
                      sku.contract_sku_num =
                        sItem.contract_sku_desc.contract_sku_num;
                      sku.sku_complete_num =
                        sItem.contract_sku_desc.sku_complete_num;
                      sku.photo = sItem.contract_sku_desc.photo;
                    }
                  });
                }
              });
          });
          console.log(res);
        });
    });
  }

  photograph(p: Sku) {
    this.camera.getPicture(this.options).then(
      imageData => {
        if (!p.photo) p.photo = [];
        let base64Image = "data:image/jpeg;base64," + imageData;
        p.photo.push(base64Image);
      },
      err => {
        this.ec.showToast({
          message: "请重新拍照",
          color: "danger"
        });
      }
    );
  }

  remove(p: Sku, i: number) {
    p.photo.splice(i, 1);
  }

  toInspectSku(p: any, sku: any) {
    if (this.verifyIpt(p, sku)) {
      let param: InspectFactoryParam = {
        apply_inspection_no: this.apply_inspect_no,
        contract_data: {
          contract_no: p.contract_no,
          inspection_complete_num: p.inspection_complete_num, //大货包装数量
          contract_sku_desc: {
            contract_sku_num: sku.contract_sku_num, //验货数量
            photo: sku.photo, //照片
            sku: sku.sku, //sku
            sku_complete_num: sku.sku_complete_num //大货生产完成数量
          }
        }
      };
      this.implementInspect.inspectFactory(param).subscribe(res => {
        this.ec.showToast({
          message: res.message
        });
        if (res.status) {
          setTimeout(() => {
            this.router.navigate(["/inspect-sku", sku.sku]);
          }, 1000);
        }
      });
    }
  }

  verifyIpt(p: any, sku: any): boolean {
    let val = true;
    if (!p.inspection_complete_num) {
      this.ec.showToast({
        message: "请输入合同大货包装完成数量",
        color: "danger"
      });
      val = false;
    } else if (!sku.contract_sku_num) {
      this.ec.showToast({
        message: "请输入sku验货数量",
        color: "danger"
      });
      val = false;
    } else if (!sku.sku_complete_num) {
      this.ec.showToast({
        message: "请输入sku生产完成数量",
        color: "danger"
      });
      val = false;
    } else if (!sku.photo) {
      this.ec.showToast({
        message: "至少上传一张照片",
        color: "danger"
      });
      // val = false;    TODO
    }
    return val;
  }
}

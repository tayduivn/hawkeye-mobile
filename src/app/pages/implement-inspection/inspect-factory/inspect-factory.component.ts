import { StorageService } from "src/app/services/storage.service";
import { PageEffectService } from "./../../../services/page-effect.service";
import { Validators, FormArray, FormControl } from "@angular/forms";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { ImplementInspectService } from "src/app/services/implement-inspect.service";

export interface FactoryModel {
  environments: string[]; //环境照片
  sampleRoom: string[]; //样品间照片
  factoryOther: string[]; // 工厂其他图片
  isOriginAddress: number; //是否是系统地址
  factoryAddress?: string; //工厂地址
  isOriginContactPerson: number; //是否是系统联系人
  worksNum: string; //工人数
  receptionist?: Receptionist; //联系人
  equipment: string; //工厂设备名称
  remarks: string[]; //备注
}

export interface Receptionist {
  name: string;
  tel?: string;
  post?: string;
}

@Component({
  selector: "app-inspect-factory",
  templateUrl: "./inspect-factory.component.html",
  styleUrls: ["./inspect-factory.component.scss"]
})
export class InspectFactoryComponent implements OnInit {
  metaData: any[];
  apply_inspect_no: string;
  data: any = {
    factory_name: "",
    factory_contacts: ""
  };

  factoryModel: FormGroup = new FormGroup({
    environments: this.fb.array([]),
    sampleRoom: this.fb.array([]),
    factoryOther: this.fb.array([]), //Validators.required
    factoryAddress: this.fb.group({
      text: this.fb.control(this.data.factoryAddress),
      isTrue: this.fb.control("1")
    }),
    worksNum: this.fb.control("", [Validators.required]),
    receptionist: this.fb.group({
      name: this.fb.control(this.data.factory_contacts),
      post: this.fb.control(""),
      tel: this.fb.control(""),
      isTrue: this.fb.control("1")
    }),
    equipment: this.fb.control("", [Validators.required]),
    remarks: this.fb.array([""])
  });

  constructor(
    private fb: FormBuilder,
    private ec: PageEffectService,
    private camera: Camera,
    private router: Router,
    private ac: ActivatedRoute,
    private storage: StorageService,
    private implementInspect: ImplementInspectService
  ) {}

  ngOnInit() {
    let IMPLEMENT_META_DATA = this.storage.get(
      "IMPLEMENT-INSPECTION-META-DATA"
    );
    this.ac.params.subscribe(res => {
      this.apply_inspect_no = res.fid;
      this.getData();
      this.data = IMPLEMENT_META_DATA.find(
        elem => elem.sku_data[0].apply_inspection_no == res.fid
      );
    });
  }

  get environments(): FormArray {
    return this.factoryModel.get("environments") as FormArray;
  }

  get sampleRoom(): FormArray {
    return this.factoryModel.get("sampleRoom") as FormArray;
  }

  get factoryOther(): FormArray {
    return this.factoryModel.get("factoryOther") as FormArray;
  }

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  setPhoto(e: any[], type: "environment" | "sampleRoom" | "factoryOther") {
    if (e && e.length) {
      (this.factoryModel.get(type) as FormArray).clear();
      for (let i = 0; i < e.length; i++) {
        (this.factoryModel.get(type) as FormArray).push(new FormControl(""));
      }
    } else {
      (this.factoryModel.get(type) as FormArray).clear();
    }
    (this.factoryModel.get(type) as FormArray).setValue(e);
  }

  remove(type: "environment" | "sampleRoom" | "factoryOther", i: number) {
    this[type].controls.splice(i, 1);
  }

  addRemarks() {
    (this.factoryModel.get("remarks") as FormArray).push(this.fb.control(""));
    console.log(this.factoryModel.get("remarks"));
  }

  getData() {
    this.implementInspect
      .getInspectData(this.apply_inspect_no)
      .subscribe(res => {
        console.log(res);

        this.factoryModel.patchValue({
         
          factoryAddress: {
            text: res.factory_data.factoryAddress.text,
            isTrue: res.factory_data.factoryAddress.isTrue
          },
          worksNum: res.factory_data.worksNum,
          receptionist: {
            name: res.factory_data.receptionist.name,
            post: res.factory_data.receptionist.post,
            tel: res.factory_data.receptionist.tel,
            isTrue: res.factory_data.receptionist.isTrue
          },
          equipment: res.factory_data.equipment,
          remarks: res.factory_data.remarks
        });
        
        setTimeout(() => {
          if(res.factory_data.environments && res.factory_data.environments.length){
            for(var i=0;i<res.factory_data.environments.length;i++){
              (this.factoryModel.get("environments") as FormArray).push(new FormControl(''))
            }
            (this.factoryModel.get('environments') as FormArray).setValue(res.factory_data.environments);
          }

          if(res.factory_data.sampleRoom && res.factory_data.sampleRoom.length){
            for(var i=0;i<res.factory_data.sampleRoom.length;i++){
              (this.factoryModel.get("sampleRoom") as FormArray).push(new FormControl(''))
            }
            (this.factoryModel.get('sampleRoom') as FormArray).setValue(res.factory_data.sampleRoom);
          }
          
          if(res.factory_data.factoryOther && res.factory_data.factoryOther.length){
            for(var i=0;i<res.factory_data.factoryOther.length;i++){
              (this.factoryModel.get("factoryOther") as FormArray).push(new FormControl(''))
            }
            (this.factoryModel.get('factoryOther') as FormArray).setValue(res.factory_data.factoryOther);
            
          }
      
        }, 2000);

      });
  }

  toInspectPo() {
    this.ec.showAlert({
      message: "正在上传",
      backdropDismiss: false
    });
    this.implementInspect
      .inspectFactory({
        factory_data: this.factoryModel.value,
        apply_inspection_no: this.apply_inspect_no
      })
      .subscribe(res => {
        this.ec.showToast({
          message: res.message,
          position: "top"
        });
        if (res.status == 1) {
          setTimeout(() => {
            this.router.navigate(["inspect-po", this.apply_inspect_no]);
          }, 1000);
        }
      });
  }

  descEnter(p: any) {
    (this.factoryModel.get("remarks") as FormArray).clear();
    for (let i = 0; i < p.length; i++) {
      (this.factoryModel.get("remarks") as FormArray).push(new FormControl(""));
    }
    (this.factoryModel.get("remarks") as FormArray).setValue(p);
    console.log(this.factoryModel.value);
  }
}

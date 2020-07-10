import { StorageService } from './../../services/storage.service';
import { MenuService } from './../../services/menu.service';
import { UserRightsService } from './../../services/user-rights.service';
import { UserInfoService } from './../../services/user-info.service';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEffectService } from '../../services/page-effect.service';
import { UploadQueueService } from '../implement-inspection/upload-queue.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
    public status: string = 'login';
    public loginInfo: loginInfo = new loginInfo('', '');

    // 定义表单
    public registerForm: FormGroup;

    // 表单验证不通过时显示的错误消息
    public formErrors = {
        username: '',
        company_no: '',
        password: '',
        password_confirmation: '',
    };

    // 为每一项表单验证添加说明文字
    validationMessage = {
        username: {
            minlength: '用户名长度最少为2个字符',
            maxlength: '用户名长度最多为10个字符',
            required: '请填写用户名',
        },
        company_no: {
            required: '请填写工号',
            pattern: '不是工号格式',
        },
        password: {
            required: '请输入密码',
        },
        password_confirmation: {
            required: '请再次输入密码',
            atypism: '两次输入不一致',
            notPwd: '请先输入密码',
        },
    };

    // 构建表单方法
    buildForm(): void {
        // 通过 formBuilder构建表单
        this.registerForm = this.fb.group({
            /* 为 username 添加3项验证规则：
             * 1.必填， 2.最大长度为10， 3.最小长度为3， 4.不能以下划线开头， 5.只能包含数字、字母、下划线
             * 其中第一个空字符串参数为表单的默认值
             */
            username: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
            company_no: ['', [Validators.required, Validators.pattern(/['X']['D'][0-9][0-9][0-9]/g)]],
            password: ['', [Validators.required]],
            password_confirmation: ['', [Validators.required]],
        });

        // 每次表单数据发生变化的时候更新错误信息
        this.registerForm.valueChanges.subscribe(data => {
            this.onValueChanged(data);
            // console.log(data);
            if (data.password_confirmation && !data.password) {
                this.formErrors['password_confirmation'] += this.validationMessage['password_confirmation']['notPwd'];
            }

            if (data.password_confirmation && data.password && data.password_confirmation !== data.password) {
                this.formErrors['password_confirmation'] += this.validationMessage['password_confirmation']['atypism'];
            }
        });

        // 初始化错误信息
        this.onValueChanged();
    }

    // 每次数据发生改变时触发此方法
    onValueChanged(data?: any) {
        // 如果表单不存在则返回
        if (!this.registerForm) return;
        // 获取当前的表单
        const form = this.registerForm;

        // 遍历错误消息对象
        for (const field in this.formErrors) {
            // 清空当前的错误消息
            this.formErrors[field] = '';
            // 获取当前表单的控件
            const control = form.get(field);

            // 当前表单存在此空间控件 && 此控件没有被修改 && 此控件验证不通过
            if (control && control.dirty && !control.valid) {
                // 获取验证不通过的控件名，为了获取更详细的不通过信息
                const messages = this.validationMessage[field];
                // 遍历当前控件的错误对象，获取到验证不通过的属性
                for (const key in control.errors) {
                    // 把所有验证不通过项的说明文字拼接成错误消息
                    this.formErrors[field] += messages[key] + '\n';
                }
            }
        }
    }

    constructor(
        public Router: Router,
        private fb: FormBuilder,
        private el: ElementRef,
        private http: HttpService,
        private userInfo: UserInfoService,
        private rights: UserRightsService,
        private menu: MenuService,
        private storage: StorageService,
        public effectCtrl: PageEffectService,
        private uQueue: UploadQueueService,
    ) {}

    ngOnInit() {
        this.buildForm();
        let userInfo = this.storage.get('USER_INFO');
        if (userInfo) {
            this.storage.remove('USER_INFO');
            this.storage.remove('PERMISSION');
        }

        let account = JSON.parse(localStorage.getItem('HAWKEYE_ACCOUNT')),
            pwd = JSON.parse(localStorage.getItem('HAWKEYE_PASSWORD'));
        if (account && pwd) {
            this.loginInfo.company_no = account;
            this.loginInfo.password = pwd;
        }
    }

    ngAfterViewInit(): void {
        this.rememberPwdBug();
    }

    rememberPwdBug() {
        setTimeout(() => {
            let inputGroup = this.el.nativeElement.querySelectorAll('ion-input');
            inputGroup.forEach(element => {
                element.children[0].style = '';
            });
        }, 2000);
    }

    isClick : boolean = false
    doLogin() {
        this.isClick = true
        this.effectCtrl
            .showLoad({
                spinner: null,
                duration: 0,
                message: '正在登录……',
                translucent: false,
            })
            .then(() => {
                let params = JSON.parse(JSON.stringify(this.loginInfo));
                this.http.post({ url: '/login', params: params }, true).subscribe(data => {
                    this.effectCtrl.loadCtrl.dismiss();
                    this.isClick = false
                    let base: any = data;
                    if (base.status == 0) {
                        this.effectCtrl.showAlert({
                            message: '登陆失败！',
                            header: '提示',
                            buttons: ['确定'],
                            subHeader: '',
                        });
                    } else {
                        this.userInfo.info = base.data;
                        this.rights.rights = base.permission.data;
                        this.storage.set('USER_INFO', this.userInfo.info);

                        this.storage.set('PERMISSION', this.rights.rights);
                        //判断是否是第一次登录
                        this.userInfo.info.is_first = base.is_first;
                        //判断是否是验货人
                        this.Router.navigate(['/home']);
                        this.menu.setMenuChange(true);

                        localStorage.setItem('HAWKEYE_ACCOUNT', JSON.stringify(this.loginInfo.company_no));
                        localStorage.setItem('HAWKEYE_PASSWORD', JSON.stringify(this.loginInfo.password));
                        
                        //先清空队列
                        this.uQueue.clear();
                        this.uQueue.globalImgCache && this.uQueue.globalImgCache.unsubscribe(); //每次登录的时候先取消订阅，防止重复发布
                        this.uQueue.pathToBase64();
                    }
                });
            });
    }

    ionViewCanLeave() {
        this.effectCtrl.clearEffectCtrl();
        console.log('ionViewCanLeave');
    }
}

export class loginInfo {
    constructor(public company_no: string, public password: string) {}
}

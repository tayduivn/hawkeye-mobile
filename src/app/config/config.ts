export const utilFn: any = {
    //公共方法
    toQueryString(obj) {
        let result = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            let values = obj[key];
            if (values && values.constructor == Array) {
                let queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                result = result.concat(queryValues);
            } else {
                result.push(this.toQueryPair(key, values));
            }
        }
        return result.join('&');
    },

    toQueryPair(key, value) {
        //参数序列化
        if (typeof value == 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    },

    formatData(params: any) {
        let arr: Array<any> = [];
        Object.keys(params).forEach(el => {
            arr.push(`${el}=${params[el]}`);
        });
        return arr.join('&');
    },

    Format(fmt: string): string {
        var o = {
            'M+': new Date().getMonth() + 1, //月份
            'd+': new Date().getDate(), //日
            'H+': new Date().getHours(), //小时
            'm+': new Date().getMinutes(), //分
            's+': new Date().getSeconds(), //秒
            'q+': Math.floor((new Date().getMonth() + 3) / 3), //季度
            S: new Date().getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        return fmt;
    },

    getPlatform(): string {
        if (
            navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
            )
        ) {
            return 'mobile'; /*window.location.href="你的手机版地址";*/
        } else {
            return 'pc'; /*window.location.href="你的电脑版地址";    */
        }
    },

    goBack() {
        history.go(-1);
    },
};
export const upLoadMaxImgLength: number = 5; //图片上传限量
export const renewInitRequestTime: number = 100000;
export const maxRenewInitRequest: number = 3;

export const AppVersion: string = 'hawkeye_1.0.9';

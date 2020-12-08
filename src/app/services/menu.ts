const appPages: Array<menuItem> = [
    {
        title: '主页',
        url: '/home',
        type: 'link',
        icon: 'home',
        active: false,
    },
    {
        title: '验货任务',
        url: '/inspect-task',
        type: 'link',
        limit: 'inspect-task',
        icon: 'contract',
        active: false,
    },
    {
        title: '执行验货',
        url: '/implement-inspection',
        type: 'link',
        limit: 'implement-inspection',
        icon: 'switch',
        active: false,
    },
    {
        title: '验货评价',
        url: '/evaluate',
        type: 'link',
        limit: 'evaluate',
        icon: 'paper',
        active: false,
    },
    {
        title: '数据对比',
        url: '/data-contrast',
        type: 'link',
        limit: 'data-contrast',
        icon: 'contrast',
        active: false,
    },
    {
        title: '返工验货',
        url: '/rework-inspect',
        type: 'link',
        limit: 'rework-inspect',
        icon: 'redo',
        active: false,
    },
    // {
    //     title: '工厂考察',
    //     url: '/purchasing-factory',
    //     type: 'link',
    //     limit: 'purchasing-factory',
    //     icon: 'build',
    //     active: false,
    // },
    // {
    //     title: '工厂评估',
    //     url: '/factory-assess',
    //     type: 'link',
    //     limit: 'factory-assess',
    //     icon: 'create',
    //     active: false,
    // },
    {
        title:'排柜',
        url:'/arraying-container',
        type:'link',
        limit:'arraying-container',
        icon:'list',
        active:false,
    },
    {
        title: '退出',
        type: 'btn',
        icon: 'exit',
        active: false,
    },
];

export interface menuItem {
    title?: string;
    url?: string;
    type?: string;
    icon?: string;
    active?: boolean;
    limit?: string;
    children?: menuItem[];
    sonIndex?: number; //手动设置active的时候用到的children的子索引
}
export var menu: Array<menuItem> = appPages;

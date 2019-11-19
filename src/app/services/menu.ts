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

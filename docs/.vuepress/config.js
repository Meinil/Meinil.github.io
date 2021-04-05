module.exports = {
    title: '薛定谔see猫',
    // 主题
    theme: 'reco',
    // 头信息
    head: [
        ['meta', { charset: 'UTF-8', version: '1'}],
        ['meta', { name: 'description', content: '个人博客'}],
        ['meta', { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['meta', { name: 'Keywords', content: '个人博客, 薛定谔see猫,程序员,java'}]
    ],
    // 网页默认语言
    locales: {
        '/': {
            lang: 'zh', // 将会被设置为 <html> 的 lang 属性
        }
    },
    // 插件
    plugins: [
        // 渲染mermaid
        ['vuepress-plugin-mermaidjs'],
        
        // 看板娘
        [
            'vuepress-plugin-helper-live2d', {
                // 是否开启控制台日志打印(default: false)
                log: false,
                live2d: {
                    // 是否启用(关闭请设置为false)(default: true)
                    enable: true,
                    // 模型名称(default: hibiki)>>>取值请参考：
                    // https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA
                    model: 'hibiki',
                    display: {
                        position: "left", // 显示位置：left/right(default: 'right')
                        width: 135, // 模型的长度(default: 135)
                        height: 300, // 模型的高度(default: 300)
                        hOffset: 50, //  水平偏移(default: 65)
                        vOffset: 0, //  垂直偏移(default: 0)
                    },
                    mobile: {
                        show: false // 是否在移动设备上显示(default: false)
                    },
                    react: {
                        opacity: 0.8 // 模型透明度(default: 0.8)
                    }
                }
            }
        ]
    ],
    themeConfig: {
        // vuepress-theme-reco主题的类型
        type: 'blog',
        // 作者
        author: '薛定谔see猫',
        // 网站logo
        logo: '/assets/img/logo.jpg',
        // 最后更新时间
        lastUpdated: 'Last Updated',
        // 头像
        authorAvatar: '/assets/img/logo.jpg',
        // 博客配置
        blogConfig: {
            subSidebar: 'auto',
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: '标签',     // 默认文案 “标签”
            },
            socialLinks: [     // 信息栏展示社交信息
                { icon: 'reco-github', link: 'https://github.com/SchrodingerSeeCat' },
                { icon: 'reco-bilibili', link: 'https://space.bilibili.com/350829452' }
            ]
        },
        nav: [
            // 主页
            { text: 'Home', link: '/', icon: 'reco-home' },
            // 时间线
            { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' }
        ],
        // 评论
        vssueConfig: {
            platform: 'github-v4',
            owner: 'SchrodingerSeeCat',
            repo: 'comment',
            clientId: '56c5af38a94daefe3515',
            clientSecret: '3fa50e00f7687da3857ca9473837e6dbb0769e22',
        },
        // 全局搜索
        // algolia: {
        //     apiKey: 'a65a7834a1981ea416dd8d8bd4d365ef',
        //     indexName: 'blog'
        // }
     }
  }
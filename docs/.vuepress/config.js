module.exports = {
    title: '薛定谔see猫',
    // 主题
    theme: 'reco',
    // 插件
    plugins: [
        'vuepress-plugin-mermaidjs'
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
        // 移动端优化
        head: [
            ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
        ],
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
            platform: 'github',
            owner: 'SchrodingerSeeCat',
            repo: 'https://github.com/SchrodingerSeeCat/comment',
            clientId: '56c5af38a94daefe3515',
            clientSecret: '3fa50e00f7687da3857ca9473837e6dbb0769e22',
        }
     }
  }
module.exports={
    configureWebpack:{
        resolve:{
            alias:{
                //在脚手架里面已经帮我们默认@是src目录下
                'assets':'@/assets',
                'common':'@/common',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views'
            }
        }
    },
    //关闭eslint
    lintOnSave:false,
    publicPath:"./",  // 可以设置成相对路径，这样所有的资源都会被链接为相对路径，打出来的包可以被部署在任意路径
    outputDir:"dist",  //打包时生成的生产环境构建文件的目录
    assetsDir: 'public'
}
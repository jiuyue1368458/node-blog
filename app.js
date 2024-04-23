const path = require('path');
const fs = require('fs');
const koa = require('koa');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const staticPath='./template/static'
const app = new koa();
const getPage=require('./data/getPage.js')
const getArticle=require('./data/getArticleMsg.js')
const template=require('./template/template.js')(path.join('./template/template.html'))
const articleTemplate=require('./template/template.js')(path.join('./template/article.html'))

app.use(
    serveStatic(path.join(__dirname, staticPath))
);

app.use(
    mount('/resume',serveStatic(path.join(__dirname, staticPath,'resume.pdf')))
);
app.use(
    mount('/svg',serveStatic(path.join(__dirname, staticPath,'nodejs.html')))
);

app.use(async (ctx, next) => {
    if (ctx.url === '/resume') {
        ctx.type = 'application/pdf';
        ctx.body = fs.readFileSync(path.join(__dirname, staticPath,'resume.pdf'));
    } else if(ctx.url==='/svg'){
        ctx.body=fs.readFileSync(path.join(__dirname,staticPath,'nodejs.html'),'utf-8')
    }
    else{
        await next();
    }
});

app.use(
    mount('/article',async(ctx)=>{
        req=+(ctx.query.articleId||0)
        if(req===0){
            ctx.body="hello";
        }
        else{
            article=getArticle(1);
            console.log(getArticle(1))
            ctx.body=articleTemplate({article});
        }

    })
)

// app.use(

    // mount('/', async (ctx) => {
    //     ctx.status = 200;
    //     const templateParams = {};
    //     getPage(1,14).forEach((data, index) => {
    //         const num = index + 1;
    //         templateParams[`Title${num}`] = data.title;
    //         templateParams[`Date${num}`] = data.date;
    //         templateParams[`Tag${num}`] = 'note';
    //         templateParams[`URL${num}`] = null;
    //     }); 
    //     ctx.body =template(templateParams)
        
    // })
// );

//fetch(`./data?sort=${this.state.sortType}&filt=${filtType}`)
app.listen(3000);
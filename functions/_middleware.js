// 自定义适配器通过请求上下文声明平台；Pages 使用原生 Functions 入口。
// 覆盖同名环境变量，避免用户配置将 Pages/Workers 误判为 Node。
export async function onRequest(context) {
    const runtime = context.data.serverRuntime;
    context.env.SERVER_RUNTIME = runtime === 'node' || runtime === 'worker' ? runtime : 'pages';

    const response = await context.next();
    const contentType = response?.headers?.get?.('content-type') || '';

    if (contentType.includes('text/html') && typeof HTMLRewriter !== 'undefined') {
        return new HTMLRewriter()
            .on('title', {
                element(e) {
                    e.setInnerContent('ImgHub · Notion Style');
                }
            })
            .on('meta[name="description"]', {
                element(e) {
                    e.setAttribute('content', 'Notion Style ImgHub - Minimalist & High-Texture File Platform');
                }
            })
            .on('meta[name="author"]', {
                element(e) {
                    e.setAttribute('content', 'Alex');
                }
            })
            .on('link[rel="mask-icon"]', {
                element(e) {
                    e.setAttribute('color', '#37352f');
                }
            })
            .on('head', {
                element(e) {
                    e.append('<link rel="preconnect" href="https://fonts.googleapis.com">', { html: true });
                    e.append('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', { html: true });
                    e.append('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">', { html: true });
                    e.append('<link href="/css/notion-theme.css" rel="stylesheet">', { html: true });
                }
            })
            .on('html', {
                element(e) {
                    e.setAttribute('lang', 'zh-CN');
                }
            })
            .on('noscript', {
                element(e) {
                    e.setInnerContent("<strong>We're sorry but ImgHub doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>", { html: true });
                }
            })
            .transform(response);
    }

    return response;
}

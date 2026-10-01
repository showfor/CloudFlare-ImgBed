# AGENTS.md — CloudFlare-ImgBed

> 工作区契约：[`../../AGENTS.md`](../../AGENTS.md)（铁律）· 资产索引：[`../../PROJECTS.md`](../../PROJECTS.md)
> 本文件只写**本项目特有**的内容：怎么跑、怎么验证、红线。

## 这是什么
个人图床与静态资源托管服务（Cloudflare Pages / Workers + KV + R2）。
**这是上游 fork**：`upstream` = `MarSeventh/CloudFlare-ImgBed`，`origin` = 自有私有仓库。

## 怎么跑 / 怎么验证
- 测试：`npm test`（mocha）
- 本地起服务：`npm run start`（`wrangler pages dev`，带 `img_url` KV 与 `img_r2` R2 绑定，端口 8080）
- 端到端：`npm run ci-test`（起服务 + 等待 8080 就绪 + 跑 mocha）
- 部署 Worker：`npm run deploy:worker`
- 验证：改动后至少跑 `npm test`；涉及绑定或路由时跑 `npm run ci-test`。

## 红线
- **不要修改上游跟踪的文件**（工作区契约第 5 条）。本地定制必须单独 commit 存证，`git pull upstream` 前先确认本地改动清单。
- `frontend-dist/`、`deploy/` 是上游的产物/部署目录，**不要手改**；前端改动走上游的构建流程。
- KV/R2 绑定与账号凭据只走 `wrangler` 配置与 secret，不入库；`wrangler.toml` 里的 D1/R2 标识符不是密钥，但也别把 token 加进去。

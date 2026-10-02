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
- 上游同步工作流 `sync-upstream.yml` 的坑（2026-10-01 记录）：
  - `permissions:` **只接受固定 scope 列表**（`actions`/`contents`/`issues`/`pull-requests`/`security-events`…）。写入不存在的键（例如 `workflows`）会让 GitHub **直接拒绝整个 workflow** —— 表现为每次推送都产生一个 0 job 的 `No jobs were run` 失败邮件，并且**每日 schedule 静默停摆**。2026-09-01 曾因此停摆整整一个月（fork 落后上游 21 个提交），2026-10-01 移除该键后恢复正常注册。
  - `GITHUB_TOKEN` **无权推送 workflow 文件的改动**，这一点无法用 `permissions:` 授予：同步遇到上游改了 `.github/workflows/**` 就会被拒。需要时在 GitHub 页面手动 **Sync fork**，或改用带 `workflow` scope 的 PAT 存为 secret。
  - `frontend-dist/index.html` **定制冲突**：本地若对 `index.html` 注入了 Notion 主题与外链，上游每次发版重新打包生成新前端 chunk hash 时，Actions 的自动 merge 必定在单行 HTML 产生内容冲突（`CONFLICT in frontend-dist/index.html`）。遇到此报错需在本地 `git fetch upstream` ➔ `git merge upstream/main` ➔ 保留最新 hash 与 Notion 定制 ➔ 提交并 `git push origin main`。

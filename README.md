# 往约智能问答系统

基于 Next.js 14 + Supabase + Moonshot AI (Kimi) 的智能问答系统。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **后端服务**: Supabase (PostgreSQL)
- **AI 引擎**: Moonshot AI (Kimi)
- **限流服务**: Upstash Redis + Ratelimit

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 用户端首页
│   ├── admin/             # 管理后台
│   ├── api/               # API 路由
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React 组件
├── lib/                   # 工具库
│   ├── supabase.ts        # Supabase 客户端
│   ├── kimi.ts           # Kimi API
│   ├── knowledge.ts      # 知识库操作
│   ├── admin.ts          # 管理员操作
│   ├── logs.ts           # 日志操作
│   └── ratelimit.ts      # 限流配置
├── types/                 # TypeScript 类型
└── utils/                 # 工具函数
```

## 环境变量说明

| 变量名 | 必填 | 说明 |
|-------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 是 | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 是 | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | 是 | Supabase Service Role Key |
| `KIMI_KEY` | 是 | Moonshot AI API Key |
| `UPSTASH_REDIS_REST_URL` | 否 | Upstash Redis URL (用于限流) |
| `UPSTASH_REDIS_REST_TOKEN` | 否 | Upstash Redis Token |
| `ADMIN_USERNAME` | 是 | 管理员用户名 |
| `ADMIN_PASSWORD_HASH` | 是 | 管理员密码哈希 |

## 开发指南

请参考 [使用指南.md](./使用指南.md) 了解详细的系统功能和使用方法。

请参考 [编码实施计划.md](./编码实施计划.md) 了解完整的开发计划。

## License

MIT

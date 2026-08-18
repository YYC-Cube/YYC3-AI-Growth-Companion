<div align="center">

<img src="public/YYC3-Family.png" alt="YYC³ Family" width="100%" />

# YYC³ AI Xiaoyu · Intelligent Growth Companion

**0–22 full-cycle AI growth guardian — the unified baseline**

[![CI](https://github.com/YYC-Cube/YYC3-AI-Growth-Companion/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/YYC-Cube/YYC3-AI-Growth-Companion/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-497%20passing-brightgreen?style=flat-square)](docs/testing.md)
[![Alerts](https://img.shields.io/badge/alerts-0-brightgreen?style=flat-square)](https://github.com/YYC-Cube/YYC3-AI-Growth-Companion/security/dependabot)
![Next.js 16.3.1](https://img.shields.io/badge/Next.js-16.3.1-black?style=flat-square&logo=next.js)
![React 19.2.3](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript 5.9.3](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![Bun](https://img.shields.io/badge/Bun-runtime-black?style=flat-square&logo=bun)
![License MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

This repository is the **single development baseline** converged from a
multi-version family (xy-01/02/03/05, the v0 line, and the parallel
YYC3-Baby unification line).

</div>

## Highlights

- 🗣️ **Real LLM chat** — BigModel GLM (glm-5.1) with six role-based system
  prompts, SSE streaming; graceful fallback to local replies without keys
- 📝 **Server-side AI proxies** — homework correction, speech-to-text and
  text-to-speech (CogTTS); zero keys in the browser
- 💾 **Real SQLite persistence** — `node:sqlite` + WAL + foreign keys with
  auto-seeding; data survives restarts
- 🏅 **Unified badge system** — 22 badges / 10 series, full API + UI + tests
- 🌐 **Dual-track i18n** — next-intl v4 for app routes; in-house zero-dependency
  `lib/i18n-core` (ICU, plugins, 10 locales) for scripts and tools
- 📊 **Prometheus metrics** at `/api/metrics`
- 🔒 **Defense in depth** — server-only keys, full security headers, production
  CSP, 0 dependency alerts
- 🤖 **Single CI pipeline** — quality gates (tests + build) and a production
  smoke job that exercises live routes on a clean runner

## Quick Start

```bash
# China mainland networks must use the mirror registry
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com bun install

cp .env.example .env.local   # set AI_API_KEY/AI_BASE_URL or OPENAI_API_KEY
bun run dev                  # http://localhost:3201

bun test                     # 497 tests, ~4s
bun run build && bun run start
```

SQLite (`data/yyc3.db`) is created and seeded automatically on first API hit.

## Documentation

| Doc | Purpose |
|---|---|
| [Developer Guide](docs/developer-guide.md) | commands, keys, module map, pitfalls |
| [Architecture](docs/architecture.md) | layers, decisions, ADR |
| [API Reference](docs/api-reference.md) | all 15 routes |
| [Deployment](docs/deployment.md) | GitHub Pages (xy.yyc3.vip) + SSR hosting |
| [Testing](docs/testing.md) | conventions and coverage map |
| [中文 README](README.md) | 简体中文主文档 |

The static landing page is auto-deployed to GitHub Pages at
**https://xy.yyc3.vip** (CNAME → YYC-Cube.github.io).

## License

MIT © 2026 YanYuCloudCube™

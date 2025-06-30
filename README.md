# Notification System Monorepo

This is simple notification system tutorial source code. 

## Project Structure
```bash
notification-system/
├── apps/
│   ├── api/    # NestJS Apps (Api)
    ├── notification-engine/     # NestJS Apps (Notification engine)
│   └── web/      # NextJs app (UI & BFF)
├── pnpm-workspace.yaml
├── package.json
```
## High Level Architecture

```bash
┌───────────────────────────────────────────────────────┐
│                  Web/REST API Service                 │
│  (NestJS - handles both event catalog & subscriptions)│
└───────────────┬───────────────────────┬───────────────┘                │                               │
                │                       │
                ▼                       ▼
┌─────────────────────────┐ ┌──────────────────────┐
│       MongoDB           │ │        Redis          │
│  (Events & Subscriptions)│ │ (Cache & Queue)      │
└─────────────────────────┘ └──────────┬───────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────┐
│               Notification Engine Service              │
│  (NestJS - handles scheduling & sending notifications)│
└───────────────────────────────────────────────────────┘

```


## Getting Started
- Install deps
```bash
pnpm install
```
- Run frontend and backend
```bash
pnpm dev
pnpm build # build both frontend and backend
```
## Docker
- `compose.yaml` file contains mongodb, redis and fake-smtp server. This is used for local development. 

## Fake SMTP 
please read this guide: [fake-smtp](https://haravich.github.io/fake-smtp-server/)
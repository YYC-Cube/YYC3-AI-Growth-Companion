# YYC³❤️AI - Intelligent Mobile AI System

> **YanYuCloudCube**  
> "All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence"

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.1.38-FBF0DF?style=flat-square&logo=bun)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com/YY-Nexus/yyc3-xyai/actions)
[![Coverage](https://img.shields.io/badge/Coverage-75%25-yellow?style=flat-square)](https://github.com/YY-Nexus/yyc3-xyai)
[![Version](https://img.shields.io/badge/Version-v2.0.0-blue?style=flat-square)](https://github.com/YY-Nexus/yyc3-xyai)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/YY-Nexus/yyc3-xyai/pulls)

**Intelligent Guardianship for Growth, Technology Illuminating Future**

[English](README_EN.md) | [中文](README.md) | [Documentation](docs/) | [API Docs](docs/10-开发资源/开发者文档.md)

</div>

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 🎯 Project Overview

YYC³❤️AI is an intelligent mobile AI system designed for 0-22 year old comprehensive growth guardianship. It integrates advanced AI technologies including event-driven architecture, goal-driven systems, RAG knowledge bases, and multi-modal interaction to provide personalized growth guidance and intelligent companionship.

### Core Vision

**"Intelligent Guardianship for Growth, Technology Illuminating Future"**

### Key Objectives

- 🎯 **Precise Development Monitoring** - Multi-dimensional development assessment and early warning
- 🎯 **Personalized Intervention** - AI-driven adaptive growth paths
- 🎯 **Emotional Companionship** - Multi-modal emotional interaction and understanding
- 🎯 **Cultural Heritage** - AI-empowered intangible cultural heritage and traditional culture protection

---

## ✨ Key Features

### 1. Intelligent AI Widget
- 🤖 **Event-driven Core Engine** - AgenticCore with event processing and goal management
- 🔧 **Dynamic Tool Ecosystem** - Automatic tool discovery and registration
- 🧠 **RAG Knowledge Base** - Vector storage and retrieval-augmented generation
- 🎯 **Goal-driven System** - Intelligent goal decomposition and execution

### 2. Growth Management System
- 📊 **Multi-dimensional Assessment** - Comprehensive development tracking
- 📈 **Development Curve** - Visual growth trajectory
- 🏆 **Badge System** - Achievement and milestone recognition
- 🎁 **Celebration System** - Milestone celebration and rewards

### 3. Voice Interaction System
- 🎙️ **Voice Recognition** - Multi-language speech recognition
- 🔊 **Voice Synthesis** - Emotional TTS with natural intonation
- 💬 **Intelligent Dialogue** - Context-aware conversation
- 🎭 **Emotional Analysis** - Real-time emotion detection

### 4. Educational Content System
- 📚 **Curriculum Management** - Age-appropriate learning materials
- 🎥 **Video Generation** - AI-powered educational videos
- 📝 **Homework Assistance** - Smart homework helper
- 🎨 **Creative Activities** - AI-empowered creative projects

### 5. Multi-language Support
- 🌐 **Internationalization** - Support for multiple languages
- 🔄 **Real-time Translation** - Automatic language switching
- 📝 **Localized Content** - Region-specific educational materials

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | 16.1.1 | React framework with SSR/SSG |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **Framer Motion** | Latest | Animation library |
| **Radix UI** | Latest | Headless UI components |
| **Three.js** | Latest | 3D graphics library |

### Backend

| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | Latest | JavaScript runtime |
| **Bun** | 1.1.38 | Fast JavaScript runtime |
| **PostgreSQL** | Latest | Relational database |
| **Redis** | Latest | Caching and session management |
| **Neo4j** | 6.0.1 | Graph database for knowledge graph |
| **Elasticsearch** | Latest | Search and analytics |

### AI/ML

| Technology | Version | Description |
|------------|---------|-------------|
| **AI SDK** | 6.0.5 | AI integration framework |
| **OpenAI** | 6.15.0 | GPT models integration |
| **TensorFlow.js** | 4.22.0 | Machine learning in browser |
| **LangChain** | Latest | LLM application framework |

### DevOps

| Technology | Description |
|------------|-------------|
| **Docker** | Containerization |
| **Kubernetes** | Container orchestration |
| **GitHub Actions** | CI/CD pipeline |
| **Prometheus** | Monitoring system |
| **Grafana** | Visualization dashboard |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun 1.1+
- PostgreSQL 14+
- Redis 6+
- Neo4j 5+

### Installation

```bash
# Clone the repository
git clone https://github.com/YY-Nexus/yyc3-xyai.git
cd yyc3-xyai

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Configure environment variables
# Edit .env file with your settings

# Initialize database
bun run db:init

# Run development server
bun run dev
```

### Docker Deployment

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3200
- **Grafana**: http://localhost:3001
- **Neo4j**: http://localhost:7474

---

## 📁 Project Structure

```
yyc3-xy-ai/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   ├── growth/           # Growth management pages
│   ├── badges/           # Badge system pages
│   └── settings/         # Settings pages
├── components/            # React components
│   ├── ai-widget/        # Intelligent AI widget
│   ├── growth/           # Growth system components
│   ├── voice/            # Voice interaction components
│   └── ui/               # UI component library
├── core/                  # Core AI systems
│   ├── AgenticCore.ts    # Event-driven core engine
│   └── ToolManager.ts    # Tool management system
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── docs/                  # Documentation
├── backend/              # Backend services
└── __tests__/            # Test files
```

---

## 📚 Documentation

### Core Documentation

- [Developer Guide](docs/10-开发资源/开发者文档.md) - Comprehensive development guide
- [User Manual](docs/10-开发资源/用户使用手册.md) - User documentation
- [Deployment Guide](docs/10-开发资源/部署与运维手册.md) - Deployment and operations

### Architecture Documentation

- [System Architecture](docs/02-架构设计/30-YYC3-XY-架构类-AI可移动系统技术架构设计.md) - Technical architecture
- [Microservices Design](docs/02-架构设计/23-YYC3-XY-架构类-AI浮窗系统五高五标五化架构设计.md) - Microservices architecture

### Implementation Documentation

- [Implementation Plan](docs/03-实施计划/31-YYC3-XY-计划类-AI可移动系统实施计划.md) - Project implementation plan
- [Implementation Summary](docs/06-实施总结/32-YYC3-XY-总结类-AI可移动系统项目总结.md) - Project summary

### Feature Modules

- [Badge System](docs/08-功能模块/YYC3-XY-勋章系统/) - Badge and achievement system
- [Growth System](docs/08-功能模块/YYC3-XY-成长系统/) - Growth tracking system
- [Type Definitions](docs/08-功能模块/YYC3-XY-类型定义/) - TypeScript type definitions

---

## 🤝 Contributing

We welcome all forms of contributions!

### How to Contribute

1. **Report Bugs** - Submit an issue describing the problem
2. **Suggest Features** - Submit an issue with feature requests
3. **Submit Code** - Fork the project, create a branch, and submit a PR
4. **Improve Documentation** - Enhance documentation and readability
5. **Share Experience** - Share your experience in Discussions

### Contribution Guidelines

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
- Read the [Contributing Guide](CONTRIBUTING.md)
- Ensure all tests pass before submitting
- Follow the coding standards defined in the project

---

## 👥 Contributors

Thank you to all developers who have contributed to this project!

### Core Team

| Name | Role | Contributions |
|------|------|---------------|
| **YYC³ Team** | Project Maintainer | Overall architecture, core features |
| **AI Team** | AI R&D | AgenticCore, knowledge graph, RAG system |
| **Frontend Team** | Frontend Development | UI components, interaction design |
| **Backend Team** | Backend Development | API design, microservices |
| **DevOps Team** | DevOps | CI/CD, monitoring, containerization |

---

## 📞 Contact

### Team Information

**YYC³ Team**

**Slogan**: "Intelligent Guardianship for Growth, Technology Illuminating Future"

**Contact**:
- 📧 Email: [admin@0379.email](mailto:admin@0379.email)
- 🌐 GitHub: [https://github.com/YY-Nexus/yyc3-xyai](https://github.com/YY-Nexus/yyc3-xyai)
- 📖 Documentation: [Project Docs](docs/)

### Support & Feedback

If you have any questions, suggestions, or feedback, please contact us:

- 🐛 Submit [Issue](https://github.com/YY-Nexus/yyc3-xyai/issues)
- 📧 Email: [admin@0379.email](mailto:admin@0379.email)
- 💬 Join [Discussions](https://github.com/YY-Nexus/yyc3-xyai/discussions)

---

<div align="center">

## ⭐ If this project helps you, please give us a Star! ⭐

---

**Made with ❤️ by YYC³ Team**

**Intelligent Guardianship for Growth, Technology Illuminating Future**

---

**Project Version**: v2.0.0
**Documentation Version**: v2.0.0
**Last Updated**: 2025-01-30
**Project Status**: ✅ Under Development
**Integration Progress**: 67% (Phase 1 & 2 completed, Phase 3 in progress)
**Project Score**: 91/100 ⭐⭐⭐⭐⭐

</div>
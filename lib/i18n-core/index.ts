/**
 * @yyc3/i18n-core — 自研零依赖国际化基础设施（一方代码内置）
 *
 * 引擎/ICU 编译器/插件系统/语言检测/缓存/RTL 支持，10 种内置语言。
 * 运行时零依赖；应用路由层的 next-intl 与之互补：
 *  - App Router 页面文案 → next-intl（middleware + Provider 已接线）
 *  - 脚本/工具/非 React 场景 → 本模块（无框架耦合）
 */
/**
 * file index.ts
 * description @yyc3/i18n-core 模块入口
 * module @yyc3/i18n-core
 * author YanYuCloudCube Team <admin@0379.email>
 * version 1.4.0
 * created 2026-04-24
 * updated 2026-04-24
 * status active
 * tags [config]
 *
 * copyright YanYuCloudCube Team
 * license MIT
 *
 * brief @yyc3/i18n-core 模块入口
 */
// Core Engine
export { I18nEngine, i18n, t } from "./lib/engine";
export type { I18nEngineConfig } from "./lib/engine";

// Cache System
export { LRUCache } from "./lib/cache";
export type { CacheConfig, CacheStats } from "./lib/cache";

// Plugin System
export { PluginManager } from "./lib/plugins";
export type { I18nContext, I18nPlugin } from "./lib/plugins";

// Built-in Plugins (from plugins/index.ts)
export {
  MissingKeyReporter,
  PerformanceTracker, createConsoleLogger
} from "./lib/plugins/index";

// Formatter utilities
export { formatRelativeTime, interpolate, pluralize } from "./lib/formatter";
export type { TranslateParams } from "./lib/formatter";

// Locale detection
export {
  detectSystemLocale, isChineseLocale, normalizeLocale
} from "./lib/detector";
export type { LocaleDetectionResult } from "./lib/detector";

// RTL Utilities
export {
  RTL_LOCALES, createMirroredLayout, flipSpacing, getAlignment, getDirection, getOppositeAlignment, isRTL, mirrorPosition, setupDocumentDirection, transformClassForRTL
} from "./lib/rtl-utils";

// Core Types
export type { HorizontalAlignment, Locale, RTLLocale, SpacingProperty, TextDirection, TranslationMap } from "./lib/types";

// ============================================================
// MCP Server (Model Context Protocol - AI Agent Integration)
// ============================================================

export { registerI18nTools } from "./lib/mcp/i18n-tools";
export { MCPServer } from "./lib/mcp/server";
export type { ToolHandler } from "./lib/mcp/server";
export type {
  MCPMessage, MCPResource, MCPServerCapabilities, MCPServerConfig,
  MCPServerInfo, MCPTool, MCPToolResult, MCPTransport
} from "./lib/mcp/types";

// ============================================================
// AI Enhancement Layer (LLM-Powered Translation)
// ============================================================

export { AIProviderManager } from "./lib/ai/provider";
export type {
  AIProvider, AIProviderConfig, AIProviderInfo, AIProviderType, TranslationRequest,
  TranslationResponse
} from "./lib/ai/provider";

export { QualityEstimator } from "./lib/ai/quality-estimator";
export type {
  QEContext, QEIssue,
  QEResult,
  QERule, QESeverity
} from "./lib/ai/quality-estimator";

export { OpenAIProvider } from "./lib/ai/openai-provider";
export { OllamaProvider } from "./lib/ai/ollama-provider";

// ============================================================
// ICU MessageFormat Engine (Based on Unicode ICU Specification)
// ============================================================

export { ICUParser } from "./lib/icu/parser";
export { ICUCompiler } from "./lib/icu/compiler";
export type { ICUCompileContext } from "./lib/icu/compiler";
export type {
  ICUNode, ICULiteral, ICUArgument, ICUPlural, ICUSelect,
  ICUSelectOrdinal, ICUNumber, ICUDate, ICUTime,
  ICUParseResult, ICUParseError, ICUPluralClause, ICUSelectClause
} from "./lib/icu/types";

// ============================================================
// MCP Transport Layer
// ============================================================

export { StdioTransport } from "./lib/mcp/stdio-transport";

// ============================================================
// CLI Tools (AST Analysis & Chinese Detection)
// ============================================================

export { ChineseDetector } from "./lib/cli/chinese-detector";
export type { DetectionResult } from "./lib/cli/chinese-detector";

// ============================================================
// Infrastructure Utilities (from FAmily π³ - High Availability)
// ============================================================

// Backoff & Retry
export {
  DEFAULT_BACKOFF_POLICY, computeBackoff, createRetryRunner, sleepWithAbort
} from "./lib/infra/backoff";
export type { BackoffPolicy } from "./lib/infra/backoff";

// Rate Limiting
export { createFixedWindowRateLimiter } from "./lib/infra/rate-limit";
export type { FixedWindowRateLimiter } from "./lib/infra/rate-limit";

// Logger
export { createLogger, getLogLevel, logger, setLogLevel } from "./lib/infra/logger";
export type { LogLevel, Logger } from "./lib/infra/logger";

// Secure Random
export {
  generateSecureFraction, generateSecureHex, generateSecureInt, generateSecureToken, generateSecureUuid
} from "./lib/infra/secure-random";

// ============================================================
// Security Utilities (from FAmily π³ - Enterprise Security)
// ============================================================

// Dangerous Operations Detection
export {
  DANGEROUS_OPERATIONS_SET, DANGEROUS_OPERATION_NAMES, getDangerousOperations, isDangerousOperation
} from "./lib/security/dangerous-operations";
export type { DangerousOperation } from "./lib/security/dangerous-operations";

// Safe Regex (ReDoS Protection)
export {
  clearSafeRegexCache, compileSafeRegex,
  testSafeRegex
} from "./lib/security/safe-regex";
export type { SafeRegexCompileResult, SafeRegexRejectReason } from "./lib/security/safe-regex";

// Secret Comparison (Timing Attack Safe)
export { safeEqualSecret } from "./lib/security/secret-equal";

// ============================================================
// General Utilities (from FAmily π³ - Production Ready)
// ============================================================

// Time Formatting
export { formatRelativeTimestamp, formatTimeAgo } from "./lib/utils/format-time";
export type { FormatRelativeTimestampOptions, FormatTimeAgoOptions } from "./lib/utils/format-time";

// Path Guards (Traversal Prevention)
export {
  hasNodeErrorCode, isNodeError, isNotFoundPathError, isPathInside, isSymlinkOpenError, normalizeWindowsPathForComparison
} from "./lib/utils/path-guards";

// JSON File Operations
export {
  deleteJsonFile, jsonFileExists, loadJsonFile,
  saveJsonFile
} from "./lib/utils/json-file";

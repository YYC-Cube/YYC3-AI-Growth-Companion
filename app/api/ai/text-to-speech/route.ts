/**
 * POST /api/ai/text-to-speech
 * 文本转语音服务端代理（统一合并版新增，P0 安全项）
 *
 * 浏览器不再持有 BigModel 密钥；客户端提交文本，服务端调用 CogTTS
 * 并以 audio/* 返回合成音频。
 */

import { getVoiceService } from '@/lib/api/voice-services';

const MAX_TEXT_LENGTH = 2000;
const VOICES = [
  'tongtong',
  'chuichui',
  'xiaochen',
  'jam',
  'kazi',
  'douji',
  'luodo',
] as const;
type VoiceName = (typeof VOICES)[number];

export async function POST(request: Request): Promise<Response> {
  try {
    const { text, voice } = (await request.json()) as {
      text?: string;
      voice?: string;
    };

    if (typeof text !== 'string' || text.trim().length === 0) {
      return Response.json({ error: '缺少有效文本（text）' }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return Response.json(
        { error: `文本过长（上限 ${MAX_TEXT_LENGTH} 字）` },
        { status: 413 }
      );
    }

    const options =
      voice && (VOICES as readonly string[]).includes(voice)
        ? { voice: voice as VoiceName }
        : {};

    const { audio } = await getVoiceService().textToSpeech(text, options);

    return new Response(audio, {
      headers: {
        'Content-Type': audio.type || 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[api] 文本转语音失败:', error);
    return Response.json({ error: '文本转语音失败，请稍后重试' }, {
      status: 500,
    });
  }
}

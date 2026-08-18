import { generateText } from 'ai';
import { getModel } from '@/lib/ai/model-provider';
import {
  AI_ROLES,
  analyzeQueryComplexity,
  getCoordinatedPrompt,
} from '@/lib/ai_roles';

const model = getModel() as any; // 统一 provider（lib/ai/model-provider），未配置密钥时为 null，由各路由的降级路径兜底

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: '消息内容不能为空' }, { status: 400 });
    }

    if (!process.env['OPENAI_API_KEY']) {
      console.error('OpenAI API key is not configured');
      return Response.json(
        { error: '服务配置错误，请检查 API 密钥' },
        { status: 500 }
      );
    }

    const { complexity, involvedRoles } = analyzeQueryComplexity(message);

    if (complexity === 'simple') {
      const role = involvedRoles[0] ?? 'advisor';
      const roleConfig = AI_ROLES[role];

      const { text } = await generateText({
        model: model as any,
        system: getCoordinatedPrompt(message, [role]),
        prompt: message,
      });

      return Response.json({
        complexity,
        mainRole: role,
        mainResponse: text,
        roleName: roleConfig.name,
        roleIcon: roleConfig.icon,
      });
    }

    if (complexity === 'medium') {
      const mainRole = involvedRoles[0] ?? 'advisor';
      const supportRole = involvedRoles[1] ?? 'companion';

      const [mainResponse, supportResponse] = await Promise.all([
        generateText({
          model: model as any,
          system: AI_ROLES[mainRole].systemPrompt,
          prompt: message,
        }),
        generateText({
          model: model as any,
          system: `基于"${AI_ROLES[supportRole].name}"的视角，针对以下问题给出补充建议（50字以内）：`,
          prompt: message,
        }),
      ]);

      return Response.json({
        complexity,
        mainRole,
        mainResponse: mainResponse.text,
        roleName: AI_ROLES[mainRole].name,
        roleIcon: AI_ROLES[mainRole].icon,
        supportingInsights: [
          {
            role: supportRole,
            roleName: AI_ROLES[supportRole].name,
            roleIcon: AI_ROLES[supportRole].icon,
            insight: supportResponse.text,
          },
        ],
      });
    }

    const coordinatedPrompt = getCoordinatedPrompt(message, involvedRoles);

    const { text: mainText } = await generateText({
      model: model as any,
      system: coordinatedPrompt,
      prompt: message,
    });

    const roleInsights = await Promise.all(
      involvedRoles.slice(1, 4).map(async role => {
        const { text } = await generateText({
          model: model as any,
          system: `你是"${AI_ROLES[role].name}"，请从你的专业角度给出一条简短建议（30字以内）：`,
          prompt: message,
        });
        return {
          role,
          roleName: AI_ROLES[role].name,
          roleIcon: AI_ROLES[role].icon,
          insight: text,
        };
      })
    );

    const { text: actionsText } = await generateText({
      model: model as any,
      system:
        '基于上述分析，给出3条具体可行的行动建议，每条15字以内，用|分隔：',
      prompt: `问题：${message}\n分析：${mainText}`,
    });

    const suggestedActions = actionsText
      .split('|')
      .map(a => a.trim())
      .filter(Boolean);

    return Response.json({
      complexity,
      mainRole: involvedRoles[0] ?? 'advisor',
      mainResponse: mainText,
      roleName: AI_ROLES[involvedRoles[0] ?? 'advisor'].name,
      roleIcon: AI_ROLES[involvedRoles[0] ?? 'advisor'].icon,
      supportingInsights: roleInsights,
      suggestedActions,
      involvedRoles: involvedRoles.map(r => ({
        id: r,
        name: AI_ROLES[r].name,
        icon: AI_ROLES[r].icon,
      })),
    });
  } catch (error: unknown) {
    console.error('[AI Orchestrate Error]', error);

    let errorMessage = 'AI协同响应失败，请稍后重试';
    let statusCode = 500;

    const errorObj = error as Error | { message?: string; status?: number };
    const errorMsg =
      errorObj instanceof Error ? errorObj.message : errorObj.message;

    if (errorMsg?.includes('API key')) {
      errorMessage = 'API密钥配置错误，请检查环境变量';
      statusCode = 401;
    } else if (errorMsg?.includes('rate limit')) {
      errorMessage = '请求过于频繁，请稍后再试';
      statusCode = 429;
    } else if (errorMsg?.includes('timeout')) {
      errorMessage = '请求超时，请重试';
      statusCode = 408;
    }

    return Response.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      },
      { status: statusCode }
    );
  }
}

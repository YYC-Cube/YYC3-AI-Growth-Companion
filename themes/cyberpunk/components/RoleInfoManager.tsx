import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { characterManager, characterValidator } from '../../../services/character';
import type { CharacterConfig, ValidationResult, ValidationMessage } from '../../../types';
import { CheckCircle2, AlertTriangle, XCircle, Wrench } from 'lucide-react';
import xiaoyuHomeImage from 'figma:asset/4a906e3a628c931914b1098cb25edfc99fd533d8.png';
import xiaoyuAvatarImage from 'figma:asset/756dfe314fb38126716f95a510053d8b3706a450.png';

export const RoleInfoManager: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadCharacter();
  }, [selectedGender]);

  const loadCharacter = () => {
    try {
      const config = characterManager.getCharacterByGender(selectedGender);
      setCharacterConfig(config);
      const result = characterValidator.validateCharacterConfig(config);
      setValidationResult(result);
    } catch (error) {
      console.error("Failed to load character:", error);
    }
  };

  const handleAutoFix = () => {
    if (!characterConfig) return;
    const fixed = characterValidator.autoFixCharacterConfig(characterConfig);
    // In a real app, we would update the manager here. 
    // Since CharacterManager doesn't expose a direct "set" method for cache, 
    // we might need to rely on `updateCharacter` if it's the *current* one, 
    // or just show the fixed version for now.
    // For this demo, we'll update local state to show the fix works.
    setCharacterConfig(fixed);
    const result = characterValidator.validateCharacterConfig(fixed);
    setValidationResult(result);
  };

  if (!characterConfig) return <div>Loading...</div>;

  // Select the appropriate avatar image based on gender
  const avatarImg = selectedGender === 'female' ? xiaoyuAvatarImage : characterConfig.avatarPath;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">角色信息管理器</h1>
        <div className="flex gap-2">
            <Button 
                variant={selectedGender === 'female' ? 'default' : 'outline'}
                onClick={() => setSelectedGender('female')}
                className={selectedGender === 'female' ? 'bg-pink-500 hover:bg-pink-600' : ''}
            >
                👧 沫语 (小语)
            </Button>
            <Button 
                variant={selectedGender === 'male' ? 'default' : 'outline'}
                onClick={() => setSelectedGender('male')}
                className={selectedGender === 'male' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
                👦 沫言 (小言)
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Status Card */}
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>状态概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                    <div className="relative w-24 h-24 mb-4">
                        <img 
                            src={avatarImg} 
                            alt={characterConfig.name} 
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                            onError={(e) => (e.currentTarget.src = '/placeholder-user.jpg')}
                        />
                    </div>
                    <h3 className="text-xl font-bold">{characterConfig.name}</h3>
                    <p className="text-sm text-gray-500">{characterConfig.age}岁 · {characterConfig.zodiac}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2 text-sm">验证状态</h4>
                    {validationResult?.isValid ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                            <CheckCircle2 size={20} />
                            <span>配置有效</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                            <XCircle size={20} />
                            <span>配置无效</span>
                        </div>
                    )}
                </div>

                {(!validationResult?.isValid || validationResult?.warnings.length > 0) && (
                    <Button onClick={handleAutoFix} className="w-full gap-2">
                        <Wrench size={16} />
                        自动修复
                    </Button>
                )}
            </CardContent>
        </Card>

        {/* Right Column: Details */}
        <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">基本信息</TabsTrigger>
                    <TabsTrigger value="report">验证报告</TabsTrigger>
                    <TabsTrigger value="json">JSON配置</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>详细配置</CardTitle>
                            <CardDescription>角色的详细属性和设置</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">ID</label>
                                    <div className="font-medium">{characterConfig.id}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">性别</label>
                                    <div className="font-medium">{characterConfig.gender === 'male' ? '男' : '女'}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">生日</label>
                                    <div className="font-medium">{characterConfig.birthday?.solar} ({characterConfig.birthday?.lunar})</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">当前主题</label>
                                    <div className="font-medium">{characterConfig.currentTheme}</div>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t">
                                <h4 className="font-medium mb-3">个性特征</h4>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                    {Object.entries(characterConfig.personality.traits).map(([trait, value]) => (
                                        <div key={trait} className="flex items-center justify-between">
                                            <span className="text-sm capitalize text-gray-600">{trait}</span>
                                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-purple-500" 
                                                    style={{ width: `${(value as number) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="report">
                    <Card>
                        <CardHeader>
                            <CardTitle>验证报告</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full pr-4">
                                {validationResult?.errors.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="flex items-center gap-2 text-red-600 font-semibold mb-2">
                                            <XCircle size={18} /> 错误 ({validationResult.errors.length})
                                        </h4>
                                        <ul className="list-disc pl-6 space-y-1 text-red-700 bg-red-50 p-4 rounded-lg text-sm">
                                            {validationResult.errors.map((err: ValidationMessage, i: number) => (
                                                <li key={i}><span className="font-mono font-bold text-xs mr-2">[{err.field}]</span> {err.message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {validationResult?.warnings.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="flex items-center gap-2 text-amber-600 font-semibold mb-2">
                                            <AlertTriangle size={18} /> 警告 ({validationResult.warnings.length})
                                        </h4>
                                        <ul className="list-disc pl-6 space-y-1 text-amber-800 bg-amber-50 p-4 rounded-lg text-sm">
                                            {validationResult.warnings.map((warn: ValidationMessage, i: number) => (
                                                <li key={i}><span className="font-mono font-bold text-xs mr-2">[{warn.field}]</span> {warn.message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {validationResult?.suggestions.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                                            <CheckCircle2 size={18} /> 建议 ({validationResult.suggestions.length})
                                        </h4>
                                        <ul className="list-disc pl-6 space-y-1 text-blue-800 bg-blue-50 p-4 rounded-lg text-sm">
                                            {validationResult.suggestions.map((sugg: ValidationMessage, i: number) => (
                                                <li key={i}><span className="font-mono font-bold text-xs mr-2">[{sugg.field}]</span> {sugg.message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {validationResult?.errors.length === 0 && validationResult?.warnings.length === 0 && validationResult?.suggestions.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500 opacity-20" />
                                        <p>完美！没有发现任何问题。</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="json">
                    <Card>
                        <CardHeader>
                            <CardTitle>JSON 配置</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full rounded-md border bg-slate-900 p-4">
                                <pre className="text-xs text-slate-50 font-mono">
                                    {JSON.stringify(characterConfig, null, 2)}
                                </pre>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
};
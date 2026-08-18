/**
 * Character System Integration
 * 角色系统集成模块 - 连接角色管理器和用户信息管理器
 * 
 * @author YYC³
 * @version 1.0.0
 */

export { CharacterManager, characterManager } from './CharacterManager';
export { CharacterInfoValidator, characterValidator } from './CharacterInfoValidator';
export type { CharacterConfig, Child, ThemeConfig, ExpressionConfig } from '../../types';

/**
 * 使用示例：
 * 
 * import { characterManager } from '@/services/character';
 * 
 * // 获取默认女性角色
 * const femaleCharacter = characterManager.getCharacterByGender('female');
 * 
 * // 根据用户信息获取个性化角色
 * const child = {
 *   id: 'child-001',
 *   name: '小明',
 *   gender: 'male',
 *   birthday: new Date('2018-05-15'),
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 * characterManager.setCurrentChild(child);
 * const personalizedCharacter = characterManager.getCharacterForUser(child);
 * 
 * // 获取角色头像
 * const avatar = characterManager.getCharacterAvatar();
 * 
 * // 获取特定场景的角色图片
 * const homePageImage = characterManager.getCharacterImage('homePage');
 * 
 * // 获取当前主题
 * const theme = characterManager.getTheme();
 * 
 * // 获取表情
 * const greetingExpression = characterManager.getExpression('greeting');
 */

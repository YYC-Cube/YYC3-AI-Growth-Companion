export interface GlobalAvatar {
  id: string;
  appearance: Record<string, any>;
  accessories: string[];
  // Add more fields as needed
}

export const avatarSystem = {
  // Mock methods
  getAvatarConfig: () => ({}),
};

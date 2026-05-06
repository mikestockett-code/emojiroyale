const BLOCKED_PROFILE_NAME_WORDS = [
  'ass', 'asshole', 'bastard', 'bitch', 'cock', 'cunt', 'damn', 'dick',
  'fuck', 'fucker', 'fucking', 'hell', 'motherfucker',
  'penis', 'piss', 'porn', 'pussy', 'shit', 'slut', 'whore',
  'fag', 'faggot', 'gay', 'homo', 'dyke', 'tranny',
  'nigger', 'nigga', 'chink', 'gook', 'kike', 'spic', 'wetback',
  'beaner', 'coon', 'jap', 'raghead', 'towelhead',
  'retard', 'retarded',
];

export const normalizeProfileNameForFilter = (value: string) =>
  value
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[!1|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[3]/g, 'e')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[^a-z]/g, '');

export const hasBlockedProfileNameWord = (value: string) => {
  const normalized = normalizeProfileNameForFilter(value);
  return BLOCKED_PROFILE_NAME_WORDS.some((word) => normalized.includes(word));
};

export const createFreshProfileId = (name: string) => {
  const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base || 'profile'}-${Date.now().toString(36)}`;
};

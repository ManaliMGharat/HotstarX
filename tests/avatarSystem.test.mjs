import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveUserAvatar,
  DEFAULT_NEUTRAL_AVATAR,
  DEFAULT_FEMALE_AVATAR,
  DEFAULT_MALE_AVATAR,
  DEFAULT_KIDS_AVATAR,
  AVATAR_PRESETS,
  isLegacyBoyAvatar,
  getAccountProfilesKey,
} from '../src/data/avatarCatalog.ts';
import { createPersonalProfile, createKidsProfile } from '../src/data/profiles.ts';

// 1. Default Neutral Avatar Fallback
test('1. Unspecified accounts with no gender or custom photo receive neutral avatar', () => {
  const profile = {
    id: 'user-manali',
    name: 'Manaligharat098',
    email: 'manaligharat098@user.hotstarx',
    isKids: false,
    genderPreference: 'unspecified',
  };

  const avatar = resolveUserAvatar(profile);
  assert.strictEqual(avatar, DEFAULT_NEUTRAL_AVATAR);
  assert.ok(avatar.startsWith('data:image/svg+xml'), 'Avatar must be a self-contained SVG data URI');
  assert.ok(!isLegacyBoyAvatar(avatar), 'Avatar must not be the legacy boy photo');
});

// 2. Strict No-Guessing Rule: Do not infer gender from username, email, or name
test('2. System never infers gender from username, email, or name', () => {
  // Even with feminine or masculine names, without explicit genderPreference it stays neutral
  const femaleNameProfile = {
    id: 'u1',
    name: 'Manali Gharat',
    email: 'manaligharat098@gmail.com',
  };
  assert.strictEqual(resolveUserAvatar(femaleNameProfile), DEFAULT_NEUTRAL_AVATAR);

  const maleNameProfile = {
    id: 'u2',
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
  };
  assert.strictEqual(resolveUserAvatar(maleNameProfile), DEFAULT_NEUTRAL_AVATAR);
});

// 3. Female Account Explicit Preference
test('3. Female account with explicit gender preference receives female avatar', () => {
  const femaleProfile = {
    id: 'u-manali',
    name: 'Manaligharat098',
    email: 'manaligharat098@user.hotstarx',
    genderPreference: 'female',
  };

  const avatar = resolveUserAvatar(femaleProfile);
  assert.strictEqual(avatar, DEFAULT_FEMALE_AVATAR);
  assert.ok(!isLegacyBoyAvatar(avatar));
});

// 4. Male Account Explicit Preference
test('4. Male account with explicit gender preference receives male avatar', () => {
  const maleProfile = {
    id: 'u-male',
    name: 'Alex',
    email: 'alex@example.com',
    genderPreference: 'male',
  };

  const avatar = resolveUserAvatar(maleProfile);
  assert.strictEqual(avatar, DEFAULT_MALE_AVATAR);
  assert.notStrictEqual(avatar, DEFAULT_FEMALE_AVATAR);
});

// 5. Custom Upload Takes Highest Priority
test('5. Custom uploaded profile picture takes priority over default avatar and gender preference', () => {
  const customPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  
  const profileWithCustom = {
    id: 'u-custom',
    name: 'Manaligharat098',
    genderPreference: 'female',
    selectedAvatarPreset: 'female-2',
    customAvatarUrl: customPhoto,
  };

  const resolved = resolveUserAvatar(profileWithCustom);
  assert.strictEqual(resolved, customPhoto, 'Custom photo must override preset and gender defaults');
});

// 6. Selected Avatar Preset Takes Precedence Over Generic Gender Default
test('6. User-selected avatar preset takes priority over generic gender default', () => {
  const presetMaya = AVATAR_PRESETS.find((p) => p.id === 'female-2');
  assert.ok(presetMaya, 'female-2 preset must exist');

  const profileWithPreset = {
    id: 'u-preset',
    name: 'Manaligharat098',
    genderPreference: 'female',
    selectedAvatarPreset: 'female-2',
  };

  const resolved = resolveUserAvatar(profileWithPreset);
  assert.strictEqual(resolved, presetMaya.dataUri);
});

// 7. Legacy Boy Photo Sanitization
test('7. Legacy hardcoded boy unsplash photo is identified and migrated cleanly', () => {
  const legacyBoyUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  assert.ok(isLegacyBoyAvatar(legacyBoyUrl), 'Must identify legacy boy photo');

  // Existing session for Manaligharat098 with legacy avatar and female preference
  const legacyFemaleUser = {
    id: 'u-manali',
    name: 'Manaligharat098',
    avatar: legacyBoyUrl,
    genderPreference: 'female',
  };
  assert.strictEqual(resolveUserAvatar(legacyFemaleUser), DEFAULT_FEMALE_AVATAR);

  // Existing session for Manaligharat098 with legacy avatar and unspecified preference
  const legacyUnspecifiedUser = {
    id: 'u-manali',
    name: 'Manaligharat098',
    avatar: legacyBoyUrl,
  };
  assert.strictEqual(resolveUserAvatar(legacyUnspecifiedUser), DEFAULT_NEUTRAL_AVATAR);
});

// 8. Kids Mode Profile
test('8. Kids profile receives family-friendly Kids Mode avatar', () => {
  const kidsProfile = createKidsProfile('Kids Space');
  assert.strictEqual(kidsProfile.isKids, true);
  assert.strictEqual(kidsProfile.avatar, DEFAULT_KIDS_AVATAR);
  assert.ok(resolveUserAvatar(kidsProfile), DEFAULT_KIDS_AVATAR);
});

// 9. Account Isolation Key Generation
test('9. Account storage keys isolate different user accounts', () => {
  const key1 = getAccountProfilesKey('Manaligharat098@user.hotstarx');
  const key2 = getAccountProfilesKey('john.doe@example.com');
  
  assert.strictEqual(key1, 'hotstarx_user_profiles_v2_manaligharat098@user.hotstarx');
  assert.strictEqual(key2, 'hotstarx_user_profiles_v2_john.doe@example.com');
  assert.notStrictEqual(key1, key2, 'Keys must be distinct to prevent cross-account avatar bleeding');
});

// 10. createPersonalProfile Factory Integrity
test('10. createPersonalProfile initializes with clean dynamic avatar and no boy photo', () => {
  const newAccount = createPersonalProfile('Manaligharat098', 'manaligharat098@user.hotstarx');
  assert.strictEqual(newAccount.name, 'Manaligharat098');
  assert.ok(!isLegacyBoyAvatar(newAccount.avatar));
  assert.strictEqual(newAccount.avatar, DEFAULT_NEUTRAL_AVATAR);

  const femaleAccount = createPersonalProfile('Manaligharat098', 'manaligharat098@user.hotstarx', 'female');
  assert.strictEqual(femaleAccount.genderPreference, 'female');
  assert.strictEqual(femaleAccount.avatar, DEFAULT_FEMALE_AVATAR);
});

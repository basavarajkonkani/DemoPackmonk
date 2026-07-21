import { readValue, writeValue } from '../storage';

export interface CompanyProfile {
  companyName: string;
  email: string;
  phone: string;
  gstNumber: string;
  tier: 'starter' | 'growth' | 'enterprise';
  clientId: string;
  ecoTargetKg: number;
}

const STORE_NAME = 'company_profile';

const SEED_PROFILE: CompanyProfile = {
  companyName: 'ZenTech Logistics',
  email: 'ops@zentech.io',
  phone: '+1 415 555 0134',
  gstNumber: '29ABCDE1234F1Z5',
  tier: 'enterprise',
  clientId: 'PM-ZENT-94107',
  ecoTargetKg: 500,
};

export async function getProfile(): Promise<CompanyProfile> {
  return readValue(STORE_NAME, SEED_PROFILE);
}

export async function updateProfile(profile: CompanyProfile): Promise<CompanyProfile> {
  await writeValue(STORE_NAME, profile);
  return profile;
}

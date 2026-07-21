import { readList, writeList, generateId } from '../storage';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addedAt: string;
  isOwner: boolean;
}

const STORE_NAME = 'team_members';

const SEED_TEAM: TeamMember[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@company.com', phone: '+91 98765 43210', role: 'Owner', addedAt: '2024-01-01', isOwner: true },
  { id: '2', name: 'Neha Verma', email: 'neha@company.com', phone: '+91 98765 43211', role: 'Manager', addedAt: '2024-01-15', isOwner: false },
  { id: '3', name: 'Vikram Singh', email: 'vikram@company.com', phone: '+91 98765 43212', role: 'Procurement', addedAt: '2024-01-20', isOwner: false },
];

export async function listTeamMembers(): Promise<TeamMember[]> {
  return readList(STORE_NAME, SEED_TEAM);
}

export async function inviteTeamMember(input: Omit<TeamMember, 'id' | 'addedAt' | 'isOwner'>): Promise<TeamMember> {
  const all = await listTeamMembers();
  const member: TeamMember = { ...input, id: generateId('member'), addedAt: new Date().toISOString().split('T')[0], isOwner: false };
  await writeList(STORE_NAME, [...all, member]);
  return member;
}

export async function updateTeamMember(member: TeamMember): Promise<TeamMember> {
  const all = await listTeamMembers();
  const updated = all.map((m) => (m.id === member.id ? member : m));
  await writeList(STORE_NAME, updated);
  return member;
}

export async function removeTeamMember(id: string): Promise<void> {
  const all = await listTeamMembers();
  await writeList(STORE_NAME, all.filter((m) => m.id !== id));
}

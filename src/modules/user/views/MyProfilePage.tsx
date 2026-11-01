import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useProfile, useUpdateProfile } from '../controllers/useUsers';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ConfirmModal } from '@/shared/components/common/ConfirmModal';
import {
  UserStatus,
  type IAddress,
  type UpdateProfileInput,
} from '../types/user.types';

type AddressAction =
  | { type: 'add'; data: IAddress }
  | { type: 'edit'; index: number; data: IAddress }
  | { type: 'delete'; index: number }
  | { type: 'setDefault'; index: number }
  | null;

export default function MyProfilePage() {
  // ─────────────── ALL HOOKS FIRST (unconditional) ───────────────
  const { data: user, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  // Profile form state
  const [pendingData, setPendingData] = useState<UpdateProfileInput | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
  } = useForm<UpdateProfileInput>();

  // Address state
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addressDraft, setAddressDraft] = useState<IAddress>(emptyAddress());
  const [addressAction, setAddressAction] = useState<AddressAction>(null);

  // Effects
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        avatar: user.avatar ?? '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    setAddresses(user?.addresses ?? []);
  }, [user]);

  // Memos — MUST guard against `user` being undefined
  const changedFields = useMemo(() => {
    if (!pendingData || !user) return [];
    return (Object.keys(dirtyFields) as (keyof UpdateProfileInput)[])
      .filter((k) => k !== 'addresses')
      .map((k) => ({
        field: k,
        before: (user as unknown as Record<string, unknown>)[k] ?? '—',
        after: pendingData[k] || '—',
      }));
  }, [pendingData, dirtyFields, user]);

  const addressModalMeta = useMemo(() => {
    if (!addressAction)
      return { title: '', message: '', confirmText: 'Confirm', variant: 'primary' as const };
    switch (addressAction.type) {
      case 'add':
        return { title: 'Add address?', message: 'This address will be saved to your profile.', confirmText: 'Add', variant: 'primary' as const };
      case 'edit':
        return { title: 'Save address changes?', message: 'Review the updated address before saving.', confirmText: 'Save', variant: 'primary' as const };
      case 'delete':
        return { title: 'Delete address?', message: 'This address will be removed from your profile.', confirmText: 'Delete', variant: 'danger' as const };
      case 'setDefault':
        return { title: 'Set as default?', message: 'Future orders will use this address by default.', confirmText: 'Set default', variant: 'primary' as const };
    }
  }, [addressAction]);

  // ─────────────── NOW early returns are safe ───────────────
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!user) return null;

  // ─────────────── Derived (non-hook) values ───────────────
  const displayName =
    user.fullName ||
    user.name ||
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
    'No name';

  const initials = (
    user.firstName?.[0] ||
    user.name?.[0] ||
    user.email?.[0] ||
    '?'
  ).toUpperCase();

  // ─────────────── Handlers (plain functions, not hooks) ───────────────
  const onSubmit = (data: UpdateProfileInput) => {
    const payload: UpdateProfileInput = {};
    (Object.keys(dirtyFields) as (keyof UpdateProfileInput)[]).forEach((k) => {
      if (k === 'addresses') return;
      (payload as Record<string, unknown>)[k] = data[k];
    });
    setPendingData(payload);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingData) return;
    updateProfile.mutate(pendingData, {
      onSuccess: () => {
        setConfirmOpen(false);
        setPendingData(null);
        reset(undefined, { keepValues: true });
      },
      onError: () => setConfirmOpen(false),
    });
  };

  const openAddAddress = () => {
    setEditingIndex(null);
    setAddressDraft(emptyAddress());
    setAddressModalOpen(true);
  };

  const openEditAddress = (index: number) => {
    setEditingIndex(index);
    setAddressDraft({ ...addresses[index] });
    setAddressModalOpen(true);
  };

  const saveAddressDraft = () => {
    const err = validateAddress(addressDraft);
    if (err) return alert(err);
    const data = normalizeAddress(addressDraft);
    setAddressModalOpen(false);
    setAddressAction(
      editingIndex === null
        ? { type: 'add', data }
        : { type: 'edit', index: editingIndex, data },
    );
  };

  const askDeleteAddress = (i: number) => setAddressAction({ type: 'delete', index: i });
  const askSetDefault = (i: number) => setAddressAction({ type: 'setDefault', index: i });
  const cancelAddressAction = () => setAddressAction(null);

  const confirmAddressAction = () => {
    if (!addressAction) return;
    const next = applyAddressAction(addresses, addressAction);
    updateProfile.mutate(
      { addresses: next },
      {
        onSuccess: () => {
          setAddresses(next);
          setAddressAction(null);
        },
        onError: () => setAddressAction(null),
      },
    );
  };

  // ─────────────── JSX ───────────────
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link to="/orders"><Button variant="outline">My Orders</Button></Link>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              {user.status && (
                <Badge variant={user.status === UserStatus.ACTIVE ? 'default' : 'outline'} className="capitalize">
                  {user.status}
                </Badge>
              )}
              <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
              </Badge>
              <Badge variant={user.phoneVerified ? 'default' : 'outline'}>
                {user.phoneVerified ? 'Phone Verified' : 'Phone Unverified'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      <Card>
        <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input {...register('firstName')} placeholder="First name" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input {...register('lastName')} placeholder="Last name" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input {...register('name')} placeholder="Display name" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={user.email} readOnly disabled className="bg-muted cursor-not-allowed" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input {...register('phone')} placeholder="+8801XXXXXXXXX" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Avatar URL</label>
                <Input {...register('avatar')} placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateProfile.isPending || !isDirty}>
                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty || updateProfile.isPending}>
                Reset
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
          </form>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Addresses</CardTitle>
          <Button size="sm" onClick={openAddAddress} disabled={updateProfile.isPending}>+ Add Address</Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((addr, i) => (
                <li key={addr._id ?? `${i}`} className="rounded-md border p-3">
                  <div className="flex justify-between gap-3">
                    <div className="text-sm">
                      <p className="font-medium">
                        {addr.type ? <span className="capitalize">{addr.type}</span> : 'Address'}
                        {addr.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                      </p>
                      {(addr.firstName || addr.lastName) && (
                        <p>{[addr.firstName, addr.lastName].filter(Boolean).join(' ')}</p>
                      )}
                      {addr.company && <p className="text-muted-foreground">{addr.company}</p>}
                      <p className="text-muted-foreground">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      </p>
                      <p className="text-muted-foreground">
                        {addr.city}
                        {addr.state ? `, ${addr.state}` : ''}
                        {addr.zila ? ` (${addr.zila})` : ''}
                        {addr.postalCode ? ` ${addr.postalCode}` : ''}
                        {addr.country ? `, ${addr.country}` : ''}
                      </p>
                      {addr.phone && <p className="text-muted-foreground">{addr.phone}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEditAddress(i)} disabled={updateProfile.isPending}>Edit</Button>
                      {!addr.isDefault && (
                        <Button size="sm" variant="outline" onClick={() => askSetDefault(i)} disabled={updateProfile.isPending}>Set default</Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => askDeleteAddress(i)} disabled={updateProfile.isPending}>Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Profile confirm */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Confirm profile changes"
        message="Please review the changes below before saving."
        confirmText="Save Changes"
        loading={updateProfile.isPending}
        onConfirm={handleConfirm}
        onCancel={() => { setConfirmOpen(false); setPendingData(null); }}
      >
        {changedFields.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm">
            {changedFields.map((c) => (
              <li key={c.field} className="flex justify-between gap-4">
                <span className="text-muted-foreground capitalize">{c.field}</span>
                <span className="text-right">
                  <span className="line-through text-muted-foreground mr-1">{String(c.before)}</span>
                  <span className="font-medium">{String(c.after)}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No changes detected.</p>
        )}
      </ConfirmModal>

      {/* Address action confirm */}
      <ConfirmModal
        isOpen={!!addressAction}
        title={addressModalMeta.title}
        message={addressModalMeta.message}
        confirmText={addressModalMeta.confirmText}
        variant={addressModalMeta.variant}
        loading={updateProfile.isPending}
        onConfirm={confirmAddressAction}
        onCancel={cancelAddressAction}
      />

      {/* Address form modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAddressModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">{editingIndex === null ? 'Add Address' : 'Edit Address'}</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <DraftSelect label="Type" value={addressDraft.type ?? 'shipping'} options={['shipping', 'billing']} onChange={(v) => setAddressDraft({ ...addressDraft, type: v as 'shipping' | 'billing' })} />
              <DraftField label="First name" value={addressDraft.firstName ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, firstName: v })} />
              <DraftField label="Last name" value={addressDraft.lastName ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, lastName: v })} />
              <DraftField label="Company" value={addressDraft.company ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, company: v })} />
              <DraftField label="Phone" value={addressDraft.phone ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, phone: v })} />
              <div className="md:col-span-2">
                <DraftField label="Address line 1 *" value={addressDraft.addressLine1} onChange={(v) => setAddressDraft({ ...addressDraft, addressLine1: v })} />
              </div>
              <div className="md:col-span-2">
                <DraftField label="Address line 2" value={addressDraft.addressLine2 ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, addressLine2: v })} />
              </div>
              <DraftField label="City *" value={addressDraft.city} onChange={(v) => setAddressDraft({ ...addressDraft, city: v })} />
              <DraftField label="State" value={addressDraft.state ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, state: v })} />
              <DraftField label="Zila" value={addressDraft.zila ?? ''} onChange={(v) => setAddressDraft({ ...addressDraft, zila: v })} />
              <DraftField label="Postal code *" value={addressDraft.postalCode} onChange={(v) => setAddressDraft({ ...addressDraft, postalCode: v })} />
              <DraftField label="Country *" value={addressDraft.country} onChange={(v) => setAddressDraft({ ...addressDraft, country: v })} />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!addressDraft.isDefault}
                onChange={(e) => setAddressDraft({ ...addressDraft, isDefault: e.target.checked })}
              />
              Set as default
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setAddressModalOpen(false)}>Cancel</Button>
              <Button type="button" onClick={saveAddressDraft}>Continue</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- helpers (not hooks — safe anywhere) ---------------- */

function emptyAddress(): IAddress {
  return {
    type: 'shipping',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    isDefault: false,
  };
}

function validateAddress(a: IAddress): string | null {
  if (!a.addressLine1?.trim()) return 'Address line 1 is required.';
  if (!a.city?.trim()) return 'City is required.';
  if (!a.postalCode?.trim()) return 'Postal code is required.';
  if (!a.country?.trim()) return 'Country is required.';
  return null;
}

function normalizeAddress(a: IAddress): IAddress {
  const trim = (s?: string) => (s ?? '').trim() || undefined;
  return {
    ...a,
    firstName: trim(a.firstName),
    lastName: trim(a.lastName),
    company: trim(a.company),
    phone: trim(a.phone),
    addressLine1: a.addressLine1.trim(),
    addressLine2: trim(a.addressLine2),
    city: a.city.trim(),
    state: trim(a.state),
    zila: trim(a.zila),
    postalCode: a.postalCode.trim(),
    country: a.country.trim(),
    isDefault: !!a.isDefault,
  };
}

function applyAddressAction(current: IAddress[], action: NonNullable<AddressAction>): IAddress[] {
  let next = [...current];
  switch (action.type) {
    case 'add': {
      const isFirst = next.length === 0;
      next.push({ ...action.data, isDefault: isFirst || !!action.data.isDefault });
      if (next.filter((a) => a.isDefault).length > 1) {
        const defIdx = next.findIndex((a) => a.isDefault);
        next = next.map((a, i) => ({ ...a, isDefault: i === defIdx }));
      }
      break;
    }
    case 'edit':
      next[action.index] = { ...action.data };
      break;
    case 'delete':
      next.splice(action.index, 1);
      if (next.length && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true };
      break;
    case 'setDefault':
      next = next.map((a, i) => ({ ...a, isDefault: i === action.index }));
      break;
  }
  return next;
}

function DraftField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function DraftSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
import {
  BRANCHES, SERVICES, LIFECYCLE, STATUS_META, initialParcels, initialRegistrations,
  initialInvoices, initialNotifications, nowLabel,
} from './data';

export const normalizeTracking = (raw) => raw.trim().toUpperCase();

export const validTracking = (tracking) => /^[A-Z0-9][A-Z0-9-]{7,39}$/.test(tracking);

export function trackingRecords({ parcels, registrations }, tracking) {
  const key = normalizeTracking(tracking);
  return {
    parcels: parcels.filter((parcel) => normalizeTracking(parcel.tracking) === key),
    registration: registrations.find((item) => normalizeTracking(item.tracking) === key),
  };
}

export function parcelGroups(parcels, registrations) {
  const received = new Set(parcels.map((p) => normalizeTracking(p.tracking)));
  return {
    waiting: registrations.filter((r) => r.status === 'waiting' && !received.has(normalizeTracking(r.tracking))),
    active: parcels.filter((p) => p.status !== 'ready_pickup' && p.status !== 'delivered'),
    ready: parcels.filter((p) => p.status === 'ready_pickup'),
    history: parcels.filter((p) => p.status === 'delivered'),
  };
}

export function createAccount(seeded) {
  return {
    branchId: BRANCHES[0].id,
    serviceId: SERVICES[0].id,
    prefs: { push: true, sms: true },
    parcels: seeded ? initialParcels : [],
    registrations: seeded ? initialRegistrations : [],
    invoices: seeded ? initialInvoices : [],
    notifications: seeded ? initialNotifications : [],
  };
}

export function accountReducer(state, action) {
  switch (action.type) {
    case 'setBranch':
      return { ...state, branchId: action.id };
    case 'setPref':
      return { ...state, prefs: { ...state.prefs, [action.key]: action.value } };
    case 'read':
      return { ...state, notifications: state.notifications.map((n) => !action.id || n.id === action.id ? { ...n, read: true } : n) };
    case 'register': {
      const { entry, timestamp } = action;
      const existing = trackingRecords(state, entry.tracking);
      if (!validTracking(entry.tracking) || existing.registration || existing.parcels.length) return state;
      const registration = {
        id: 'reg-' + entry.tracking,
        tracking: entry.tracking,
        carrier: entry.carrier || 'Тээвэрлэгч тодорхойгүй',
        orderRef: entry.orderRef || '',
        branchId: state.branchId,
        serviceId: state.serviceId,
        status: 'waiting',
        createdAt: nowLabel(timestamp),
      };
      return { ...state, registrations: [registration, ...state.registrations] };
    }
    case 'receive': {
      const { parcels, registration } = trackingRecords(state, action.tracking);
      if (!registration || parcels.length) return state;
      const time = nowLabel(action.timestamp);
      const parcel = {
        id: 'demo-' + registration.id,
        code: 'OD-DEMO-' + registration.tracking,
        tracking: registration.tracking,
        carrier: registration.carrier,
        branchId: registration.branchId ?? state.branchId,
        serviceId: registration.serviceId ?? state.serviceId,
        status: 'received_china',
        weight: null,
        dims: null,
        invoiceId: null,
        history: [
          { status: 'registered', time: registration.createdAt },
          { status: 'received_china', time, location: 'Эрээн дэх агуулах' },
        ],
      };
      return {
        ...state,
        parcels: [parcel, ...state.parcels],
        notifications: [{
          id: 'n-' + parcel.id + '-received_china',
          type: 'received_china',
          parcelId: parcel.id,
          title: STATUS_META.received_china.label,
          body: 'Тээврийн дугаар: ' + parcel.tracking,
          time,
          read: false,
        }, ...state.notifications],
      };
    }
    case 'advance': {
      const { id, expectedStatus, timestamp } = action;
      const target = state.parcels.find((parcel) => parcel.id === id);
      if (!target || target.status !== expectedStatus) return state;
      const index = LIFECYCLE.indexOf(target.status);
      const next = index >= 0 ? LIFECYCLE[index + 1] : undefined;
      if (!next) return state;
      const branch = BRANCHES.find((b) => b.id === target.branchId);
      const service = SERVICES.find((s) => s.id === target.serviceId);
      const weight = target.weight || (next === 'measured' ? '2.1 кг' : null);
      const dims = target.dims || (next === 'measured' ? '25 × 20 × 12 см' : null);
      const time = nowLabel(timestamp);
      const invoice = next === 'ready_pickup' && !target.invoiceId ? {
        id: 'inv-' + target.id,
        number: target.code.replace('OD-', 'INV-'),
        date: time.split(' ')[0],
        currency: '₮',
        lines: [{
          parcelCode: target.code,
          desc: [weight, service?.label].filter(Boolean).join(' · '),
          amount: Math.round((parseFloat(weight) || 0) * (service?.id === 'suda' ? 13000 : 11000)),
        }],
        payments: [],
      } : null;
      const event = {
        status: next,
        time,
        location: ['received_branch', 'ready_pickup', 'delivered'].includes(next) ? branch?.name : undefined,
        note: next === 'measured' && weight ? 'Жин: ' + weight : undefined,
      };
      const notification = {
        id: 'n-' + target.id + '-' + next,
        type: next,
        parcelId: target.id,
        title: STATUS_META[next].label,
        body: 'Ачааны дугаар: ' + target.code + (event.location ? ' · ' + event.location : ''),
        time,
        read: false,
      };
      const parcel = { ...target, status: next, weight, dims, invoiceId: invoice?.id ?? target.invoiceId, history: [...target.history, event] };
      return {
        ...state,
        parcels: state.parcels.map((p) => p.id === id ? parcel : p),
        invoices: invoice ? [invoice, ...state.invoices] : state.invoices,
        notifications: [notification, ...state.notifications],
      };
    }
    default:
      return state;
  }
}

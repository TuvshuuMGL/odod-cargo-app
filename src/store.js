import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { BRANCHES, SERVICES, userInitial } from './data';
import { createAccount, accountReducer, normalizeTracking } from './workflow';

const AppContext = createContext(null);
const demoPhone = '+976 88112233';

function reducer(state, action) {
  if (action.type === 'signIn') {
    const { phone } = action;
    return { phone, accounts: { ...state.accounts, [phone]: state.accounts[phone] ?? createAccount(phone === demoPhone) } };
  }
  if (action.type === 'signOut') return { ...state, phone: '' };
  if (!state.phone) return state;
  const account = state.accounts[state.phone];
  const updated = accountReducer(account, action);
  return updated === account ? state : { ...state, accounts: { ...state.accounts, [state.phone]: updated } };
}

const signedOutAccount = createAccount(false);

export function AppProvider({ children }) {
  const [{ phone, accounts }, dispatch] = useReducer(reducer, { phone: '', accounts: {} });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const account = accounts[phone] ?? signedOutAccount;
  const { branchId, serviceId } = account;
  const branch = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];
  const service = SERVICES.find((s) => s.id === serviceId) ?? SERVICES[0];
  const user = phone === demoPhone ? userInitial : { name: 'Хэрэглэгч', fullName: 'Туршилтын хэрэглэгч', code: phone ? 'D-' + phone.slice(-8) : '' };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const value = {
    ...account,
    phone,
    authed: Boolean(phone),
    user,
    branch,
    service,
    toast,
    showToast,
    setBranchId: (id) => dispatch({ type: 'setBranch', id }),
    setPref: (key, value) => dispatch({ type: 'setPref', key, value }),
    signIn: (phone) => dispatch({ type: 'signIn', phone }),
    signOut: () => {
      clearTimeout(toastTimer.current);
      setToast(null);
      dispatch({ type: 'signOut' });
    },
    registerTracking: (entry) => {
      const tracking = normalizeTracking(entry.tracking);
      dispatch({ type: 'register', entry: { ...entry, tracking }, timestamp: new Date() });
      return tracking;
    },
    receiveDemoParcel: (tracking) => dispatch({ type: 'receive', tracking, timestamp: new Date() }),
    markRead: (id) => dispatch({ type: 'read', id }),
    markAllRead: () => dispatch({ type: 'read' }),
    advanceParcel: (id, expectedStatus) => dispatch({ type: 'advance', id, expectedStatus, timestamp: new Date() }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

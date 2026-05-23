import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
const createEmptyUserState = (currency = 'THB') => ({
    goals: [],
    transactions: [],
    vaults: [],
    retirementPlan: null,
    currency,
});
const persistActiveUserState = (state) => {
    if (!state.activeUserId)
        return state.userDataById;
    return {
        ...state.userDataById,
        [state.activeUserId]: {
            goals: state.goals,
            transactions: state.transactions,
            vaults: state.vaults,
            retirementPlan: state.retirementPlan,
            currency: state.currency ?? 'THB',
        },
    };
};
const loadUserState = (userDataById, userId, fallbackCurrency = 'THB') => {
    if (!userId)
        return createEmptyUserState(fallbackCurrency);
    const s = userDataById[userId];
    if (!s)
        return createEmptyUserState(fallbackCurrency);
    return {
        goals: s.goals ?? [],
        transactions: s.transactions ?? [],
        vaults: s.vaults ?? [],
        retirementPlan: s.retirementPlan ?? null,
        currency: s.currency ?? fallbackCurrency,
    };
};
const buildStateForUser = (state, nextUser, nextUserDataById) => {
    const scopedState = loadUserState(nextUserDataById, nextUser?.id ?? null, state.currency ?? 'THB');
    return {
        users: nextUser && !state.users.some((user) => user.id === nextUser.id)
            ? [...state.users, nextUser]
            : state.users.map((user) => (user.id === nextUser?.id ? nextUser : user)),
        activeUserId: nextUser?.id ?? null,
        user: nextUser,
        currency: scopedState.currency ?? 'THB',
        goals: scopedState.goals,
        transactions: scopedState.transactions,
        vaults: scopedState.vaults,
        retirementPlan: scopedState.retirementPlan,
        userDataById: {
            ...nextUserDataById,
            ...(nextUser ? { [nextUser.id]: scopedState } : {}),
        },
    };
};
export const useAppStore = create()(persist((set, get) => ({
    users: [],
    activeUserId: null,
    user: null,
    currency: 'THB',
    goals: [],
    transactions: [],
    vaults: [],
    retirementPlan: null,
    userDataById: {},
    setUser: (user) => set((state) => {
        const userDataById = persistActiveUserState(state);
        const nextUser = state.users.find((existingUser) => existingUser.id === user.id)
            ? { ...user }
            : user;
        return buildStateForUser(state, nextUser, userDataById);
    }),
    switchUser: (userId) => set((state) => {
        const userDataById = persistActiveUserState(state);
        const nextUser = state.users.find((user) => user.id === userId) ?? null;
        if (!nextUser)
            return state;
        return buildStateForUser(state, nextUser, userDataById);
    }),
    logout: () => set((state) => ({
        userDataById: persistActiveUserState(state),
        activeUserId: null,
        user: null,
        goals: [],
        transactions: [],
        vaults: [],
        retirementPlan: null,
    })),
    deleteUser: (userId) => set((state) => {
        const userDataById = persistActiveUserState(state);
        const users = state.users.filter((user) => user.id !== userId);
        const { [userId]: _removedUserData, ...restUserData } = userDataById;
        if (state.activeUserId !== userId) {
            return {
                users,
                userDataById: restUserData,
                currency: state.currency ?? 'THB',
            };
        }
        const nextUser = users[0] ?? null;
        const nextUserState = loadUserState(restUserData, nextUser?.id ?? null);
        return {
            users,
            activeUserId: nextUser?.id ?? null,
            user: nextUser,
            currency: nextUserState.currency ?? 'THB',
            goals: nextUserState.goals,
            transactions: nextUserState.transactions,
            vaults: nextUserState.vaults,
            retirementPlan: nextUserState.retirementPlan,
            userDataById: restUserData,
        };
    }),
    updateUser: (updates) => set((state) => {
        if (!state.user)
            return state;
        const updatedUser = { ...state.user, ...updates };
        const userDataById = persistActiveUserState(state);
        return {
            users: state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
            activeUserId: updatedUser.id,
            user: updatedUser,
            userDataById,
            currency: state.currency ?? 'THB',
        };
    }),
    setCurrency: (currency) => set((state) => {
        if (!state.user) {
            return { currency };
        }
        const userId = state.user.id;
        return {
            currency,
            userDataById: {
                ...persistActiveUserState(state),
                [userId]: {
                    goals: state.goals,
                    transactions: state.transactions,
                    vaults: state.vaults,
                    retirementPlan: state.retirementPlan,
                    currency,
                },
            },
        };
    }),
    addGoal: (goal) => set((state) => {
        if (!state.user)
            return state;
        const nextGoals = [...state.goals, {
                ...goal,
                userId: state.user.id,
                id: crypto.randomUUID(),
                createdAt: dayjs().toISOString(),
            }];
        return {
            goals: nextGoals,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: nextGoals,
                    transactions: state.transactions,
                    vaults: state.vaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    updateGoal: (id, updates) => set((state) => {
        if (!state.user)
            return state;
        const nextGoals = state.goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal));
        return {
            goals: nextGoals,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: nextGoals,
                    transactions: state.transactions,
                    vaults: state.vaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    deleteGoal: (id) => set((state) => {
        if (!state.user)
            return state;
        const nextGoals = state.goals.filter((goal) => goal.id !== id);
        return {
            goals: nextGoals,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: nextGoals,
                    transactions: state.transactions,
                    vaults: state.vaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    addTransaction: (tx) => set((state) => {
        if (!state.user)
            return state;
        const nextTransactions = [{ ...tx, userId: state.user.id, id: crypto.randomUUID() }, ...state.transactions];
        return {
            transactions: nextTransactions,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: nextTransactions,
                    vaults: state.vaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    deleteTransaction: (id) => set((state) => {
        if (!state.user)
            return state;
        const nextTransactions = state.transactions.filter((transaction) => transaction.id !== id);
        return {
            transactions: nextTransactions,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: nextTransactions,
                    vaults: state.vaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    addVault: (vault) => set((state) => {
        if (!state.user)
            return state;
        const nextVaults = [...state.vaults, {
                ...vault,
                userId: state.user.id,
                id: crypto.randomUUID(),
                createdAt: dayjs().toISOString(),
            }];
        return {
            vaults: nextVaults,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: state.transactions,
                    vaults: nextVaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    updateVault: (id, updates) => set((state) => {
        if (!state.user)
            return state;
        const nextVaults = state.vaults.map((vault) => (vault.id === id ? { ...vault, ...updates } : vault));
        return {
            vaults: nextVaults,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: state.transactions,
                    vaults: nextVaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    deleteVault: (id) => set((state) => {
        if (!state.user)
            return state;
        const nextVaults = state.vaults.filter((vault) => vault.id !== id);
        return {
            vaults: nextVaults,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: state.transactions,
                    vaults: nextVaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    depositToVault: (id, amount) => set((state) => {
        if (!state.user)
            return state;
        const nextVaults = state.vaults.map((vault) => (vault.id === id ? { ...vault, currentAmount: vault.currentAmount + amount } : vault));
        return {
            vaults: nextVaults,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: state.transactions,
                    vaults: nextVaults,
                    retirementPlan: state.retirementPlan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    setRetirementPlan: (plan) => set((state) => {
        if (!state.user)
            return state;
        return {
            retirementPlan: plan,
            userDataById: {
                ...persistActiveUserState(state),
                [state.user.id]: {
                    goals: state.goals,
                    transactions: state.transactions,
                    vaults: state.vaults,
                    retirementPlan: plan,
                    currency: state.currency ?? 'THB',
                },
            },
        };
    }),
    getMonthlySpend: (month = dayjs().format('YYYY-MM')) => {
        return get().transactions
            .filter((t) => t.type === 'expense' && t.date.startsWith(month))
            .reduce((sum, t) => sum + t.amount, 0);
    },
    getMonthlyIncome: (month = dayjs().format('YYYY-MM')) => {
        return get().transactions
            .filter((t) => t.type === 'income' && t.date.startsWith(month))
            .reduce((sum, t) => sum + t.amount, 0);
    },
    getCategorySpend: (month = dayjs().format('YYYY-MM')) => {
        return get().transactions
            .filter((t) => t.type === 'expense' && t.date.startsWith(month))
            .reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {});
    },
}), {
    name: 'fingoal-storage',
    version: 1,
    migrate: (persistedState) => {
        const state = persistedState;
        if (state.users || state.userDataById) {
            const userDataById = state.userDataById ?? {};
            const users = state.users ?? (state.user ? [state.user] : []);
            const activeUserId = state.activeUserId ?? state.user?.id ?? null;
            const activeState = loadUserState(userDataById, activeUserId);
            return {
                users,
                activeUserId,
                user: state.user ?? users.find((user) => user.id === activeUserId) ?? null,
                goals: activeState.goals,
                transactions: activeState.transactions,
                vaults: activeState.vaults,
                retirementPlan: activeState.retirementPlan,
                userDataById,
            };
        }
        const user = state.user ?? null;
        if (!user) {
            return {
                users: [],
                activeUserId: null,
                user: null,
                goals: [],
                transactions: [],
                vaults: [],
                retirementPlan: null,
                userDataById: {},
            };
        }
        const userState = {
            goals: state.goals ?? [],
            transactions: state.transactions ?? [],
            vaults: state.vaults ?? [],
            retirementPlan: state.retirementPlan ?? null,
        };
        return {
            users: [user],
            activeUserId: user.id,
            user,
            ...userState,
            userDataById: {
                [user.id]: userState,
            },
        };
    },
}));

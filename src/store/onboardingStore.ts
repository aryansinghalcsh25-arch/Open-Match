// ============================================================
// onboardingStore.ts
// ============================================================
// This file creates a "shared notepad" (Zustand store) that
// holds all the answers the user fills in during the 6-step
// onboarding wizard.
//
// WHY ZUSTAND?
//   Each step is its own component. Without a shared store,
//   Step 3 would have no idea what the user picked in Step 1.
//   Zustand lets every step read and write to the same place.
// ============================================================

import { create } from 'zustand'

// ---- Types ------------------------------------------------

// The three roles a user can pick in Step 1
export type UserRole =
  | 'maintainer'    // "I'm a Project Maintainer"
  | 'contributor'   // "I'm an Experienced Contributor"
  | 'newcomer'      // "I'm a Newcomer to Open Source"

// A single skill entry — used in Step 4
export interface SkillEntry {
  name: string
  category: string
  confidence: 'beginner' | 'intermediate' | 'advanced'
}

// The shape of everything we collect during onboarding
export interface OnboardingData {
  // Step 1
  role: UserRole | null

  // Step 2 (we'll fill these in later)
  displayName: string
  bio: string
  location: string
  timezone: string
  avatarUrl: string | null

  // Step 3
  githubImported: boolean
  githubLanguages: { name: string; color: string }[]
  githubRepoCount: number
  githubPrCount: number
  githubContributions: number[]   // 12 numbers — one bar per month

  // Step 4
  skills: SkillEntry[]

  // Step 5
  projectTypes: string[]       // which project types they prefer
  contributionTypes: string[]  // what kind of contributions they make
  availability: string         // hours per week available

  // Step 6
  wantsMentor: boolean   // newcomer: wants a mentor matched
  goals: string          // contributor/maintainer: 3-month goals
}

// The fields Step 2 collects — a subset of OnboardingData
export interface ProfileBasicsPayload {
  displayName: string
  bio: string
  location: string
  timezone: string
  avatarUrl: string | null
}

// The fields Step 3 saves
export interface GitHubDataPayload {
  githubImported: boolean
  githubLanguages: { name: string; color: string }[]
  githubRepoCount: number
  githubPrCount: number
  githubContributions: number[]
}

// The fields Step 5 saves (for contributor / maintainer)
export interface PreferencesPayload {
  projectTypes: string[]
  contributionTypes: string[]
  availability: string
}

// The fields Step 6 saves
export interface FinalStepPayload {
  wantsMentor: boolean
  goals: string
}

// The shape of the store itself — data + actions (functions)
interface OnboardingStore {
  currentStep: number
  data: OnboardingData

  setRole: (role: UserRole) => void                          // Step 1
  setProfileBasics: (payload: ProfileBasicsPayload) => void  // Step 2
  setGitHubData: (payload: GitHubDataPayload) => void        // Step 3
  setSkills: (skills: SkillEntry[]) => void                       // Step 4
  setPreferences: (payload: PreferencesPayload) => void            // Step 5
  setFinalStep: (payload: FinalStepPayload) => void                 // Step 6
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void
}

// ---- Default (empty) state --------------------------------

const defaultData: OnboardingData = {
  role: null,
  displayName: '',
  bio: '',
  location: '',
  timezone: '',
  avatarUrl: null,
  githubImported: false,
  githubLanguages: [],
  githubRepoCount: 0,
  githubPrCount: 0,
  githubContributions: [],
  skills: [],
  projectTypes: [],
  contributionTypes: [],
  availability: '',
  wantsMentor: true,
  goals: '',
}

// ---- Create the store -------------------------------------
//
// `create` from Zustand gives us a hook called `useOnboardingStore`.
// Any component can call `useOnboardingStore()` to read or update
// the data below.

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 1,
  data: defaultData,

  // Save the selected role into store.data.role
  setRole: (role) =>
    set((state) => ({
      data: { ...state.data, role },
      //      ^^^^^^^^^^^^^^^^^^^
      // "...state.data" copies all existing fields (bio, skills, etc.)
      // then we overwrite just `role` with the new value.
    })),

  // Save display name, bio, location, timezone, avatarUrl from Step 2
  setProfileBasics: (payload) =>
    set((state) => ({
      data: { ...state.data, ...payload },
      //                     ^^^^^^^^^^^
      // Spreads all Step 2 fields on top of the existing data.
      // Everything from Step 1 (role) is preserved.
    })),

  // Save GitHub import results from Step 3
  setGitHubData: (payload) =>
    set((state) => ({
      data: { ...state.data, ...payload },
    })),

  // Save chosen skills array from Step 4
  setSkills: (skills) =>
    set((state) => ({
      data: { ...state.data, skills },
    })),

  // Save preferences from Step 5 (contributor / maintainer path)
  setPreferences: (payload) =>
    set((state) => ({
      data: { ...state.data, ...payload },
    })),

  // Save mentor choice / goals from Step 6
  setFinalStep: (payload) =>
    set((state) => ({
      data: { ...state.data, ...payload },
    })),

  // Move forward — but never past step 6
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 6),
    })),

  // Move backward — but never before step 1
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  // Jump directly to a step (used for testing / deep links)
  setStep: (step) => set({ currentStep: step }),
}))

"use client";

import { useSyncExternalStore } from "react";
import type { ListEntry, Profile } from "./types";

// v1 keeps everything in this browser's localStorage. Swapping these
// stores for a real backend (e.g. Supabase) only touches this file.

type Store<T> = {
  get: () => T;
  set: (value: T | ((prev: T) => T)) => void;
  subscribe: (cb: () => void) => () => void;
  initial: T;
};

function createStore<T>(key: string, initial: T): Store<T> {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = initial;

  const get = () => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : initial;
      } catch {
        cachedValue = initial;
      }
    }
    return cachedValue;
  };

  const set = (value: T | ((prev: T) => T)) => {
    const next = typeof value === "function" ? (value as (p: T) => T)(get()) : value;
    try {
      if (next === null || next === undefined) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      cachedValue = next;
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => e.key === key && cb();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  };

  return { get, set, subscribe, initial };
}

function useStore<T>(store: Store<T>): [T, Store<T>["set"]] {
  const value = useSyncExternalStore(store.subscribe, store.get, () => store.initial);
  return [value, store.set];
}

// Tells client components whether they are past hydration, so pages can
// avoid flashing "no profile" before localStorage has been read.
const noop = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export const profileStore = createStore<Profile | null>("quest.profile", null);
export const listStore = createStore<ListEntry[]>("quest.list", []);
export const roadmapStore = createStore<string[]>("quest.roadmap.done", []);

export type ChatMessage = { role: "user" | "assistant"; content: string };
export const chatStore = createStore<ChatMessage[]>("quest.chat", []);

export const useProfile = () => useStore(profileStore);
export const useList = () => useStore(listStore);
export const useRoadmapDone = () => useStore(roadmapStore);
export const useChat = () => useStore(chatStore);

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

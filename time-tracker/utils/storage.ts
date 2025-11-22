import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimeEntry } from "../types/timeEntry";

const STORAGE_KEY = "@time_entries";

// Get all entries
export async function getEntries(): Promise<TimeEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading:", error);
    return [];
  }
}

// Save all entries
export async function saveEntries(entries: TimeEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving", error);
  }
}

// Add new entries
export async function addEntry(entry: TimeEntry): Promise<void> {
  const entries = await getEntries();
  entries.push(entry);
  await saveEntries(entries);
}

// Update an existing entry (after clocking out)
export async function updateEntry(
  id: string,
  updates: Partial<TimeEntry>
): Promise<void> {
  const entries = await getEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    await saveEntries(entries);
  }
}

// Get the active entry (after clocking in)
export async function getActiveEntry(): Promise<TimeEntry | null> {
  const entries = await getEntries();
  return entries.find((e) => !e.clockOut) || null;
}

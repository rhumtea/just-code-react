import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getEntries,
  addEntry,
  updateEntry,
  getActiveEntry,
} from "../../utils/storage";
import { TimeEntry } from "../../types/timeEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SimpleTimeTracker() {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  //   useEffect(() => {
  //     AsyncStorage.getItem("@time_entries").then((data) => {
  //       console.log("Stored data:", JSON.parse(data || "[]"));
  //     });
  //   }, []);
  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // Load Data
  const loadData = async () => {
    const active = await getActiveEntry();
    const allEntries = await getEntries();
    setActiveEntry(active);
    setEntries(allEntries);
  };

  // Button handler
  const handleToggle = async () => {
    if (activeEntry) {
      await clockOut();
    } else {
      await clockIn();
    }
  };

  // Clock in
  const clockIn = async () => {
    const now = new Date();
    const entry: TimeEntry = {
      id: Date.now().toString(),
      clockIn: now.toISOString(),
    };
    await addEntry(entry);
    await loadData();
    Alert.alert("Clocked In");
  };

  // Clock out
  const clockOut = async () => {
    if (!activeEntry) return;
    const now = new Date();
    const clockInTime = new Date(activeEntry.clockIn).getTime();
    const clockOutTime = now.getTime();
    const durationMinutes = Math.floor(
      (clockOutTime - clockInTime) / 1000 / 60
    );
    await updateEntry(activeEntry.id, {
      clockOut: now.toISOString(),
      duration: durationMinutes,
    });
    await loadData();
    Alert.alert("Clock Out", `You worked for ${durationMinutes}`);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTotalHours = (): string => {
    const total = entries
      .filter((e) => e.duration)
      .reduce((sum, e) => sum + (e.duration || 0), 0);
    return formatDuration(total);
  };

  const getCurrentDuration = (): string => {
    if (!activeEntry) return "0h 0m";
    const start = new Date(activeEntry.clockIn).getTime();
    const now = currentTime.getTime();
    const minutes = Math.floor((now - start) / 1000 / 60);
    return formatDuration(minutes);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Time Tracker</Text>
        <Text style={styles.subtitle}>Total: {getTotalHours()}</Text>
      </View>

      <View style={styles.clockCard}>
        <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>
        <Text style={styles.date}>{currentTime.toLocaleDateString()}</Text>
      </View>

      {activeEntry && (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Current Working</Text>
          <Text style={styles.statusTime}>
            Since: {new Date(activeEntry.clockIn).toLocaleTimeString()}
          </Text>
          <Text style={styles.duration}>{getCurrentDuration()}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          activeEntry ? styles.clockOutButton : styles.clockInButton,
        ]}
        onPress={handleToggle}
      >
        <Text style={styles.buttonText}>
          {activeEntry ? "Clock Out" : "Clock In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.entriesList}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {entries.length === 0 ? (
          <Text style={styles.emptyText}> No entries yet.</Text>
        ) : (
          entries
            .slice()
            .reverse()
            .map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text>{new Date(entry.clockIn).toLocaleDateString()}</Text>
                  {!entry.clockOut && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  )}
                </View>
                <View style={styles.entryDetails}>
                  <Text style={styles.entryTime}>
                    In: {new Date(entry.clockIn).toLocaleTimeString()}
                  </Text>
                  <Text style={styles.entryTime}>
                    Out:{" "}
                    {entry.clockOut
                      ? new Date(entry.clockOut).toLocaleTimeString()
                      : "--"}
                  </Text>
                </View>
                {entry.duration && (
                  <Text style={styles.entryDuration}>
                    Duration: {formatDuration(entry.duration)}
                  </Text>
                )}
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  clockCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  statusCard: {
    backgroundColor: "#E8F5E9",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
  },
  statusTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  duration: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 10,
  },
  button: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clockInButton: {
    backgroundColor: "#4CAF50",
  },
  clockOutButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  entriesList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    padding: 20,
  },
  entryCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activeBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  entryDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  entryTime: {
    fontSize: 14,
    color: "#666",
  },
  entryDuration: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 5,
  },
});

import { View, Button, StyleSheet, Text } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [number, setNumber] = useState(0);
  const handleIncrease = () => {
    setNumber((prev) => prev + 1);
  };
  const handleDecrease = () => {
    setNumber((prev) => prev - 1);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={[
            { fontSize: 48, fontWeight: "bold", marginVertical: 20 },
            { color: number > 0 ? "green" : number === 0 ? "gray" : "red" },
          ]}
        >
          {number}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button title="[ + ]" onPress={handleIncrease} />
        <Button title="[ - ]" onPress={handleDecrease} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

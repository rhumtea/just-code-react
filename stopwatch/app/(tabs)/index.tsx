import { View, Button } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [timer, setTimer] = useState(0);
  const [id, setId] = useState(0);
  const [status, setStatus] = useState("Start");

  const handlePress = () => {
    if (status === "Start") {
      let i = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setId(i);
      setStatus("Stop");
    } else if (status === "Stop") {
      clearInterval(id);
      setStatus("Start");
    }
  };

  const handleReset = () => {
    clearInterval(id);
    setTimer(0);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ borderBlockColor: "black" }}>{timer}</View>
      <View style={{ flexDirection: "row" }}>
        <Button title="Reset" onPress={handleReset} />
        <Button title={status} onPress={handlePress} />
      </View>
    </View>
  );
}

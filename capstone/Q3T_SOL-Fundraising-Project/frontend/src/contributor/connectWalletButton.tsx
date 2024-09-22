import React from "react";
import Connectors from "./connector.tsx";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletConnectButton() {
  return (
    <div style={styles.container}>
      <WalletMultiButton />
    </div>
  );
}

const styles = {
  container: {
    position: "absolute" as "absolute",
    top: "20px",
    right: "20px",
  },
  button: {
    backgroundColor: "grey",
    color: "#ffffff",
    border: "none",
    borderRadius: "30px",
    padding: "10px 20px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0px 10px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#3700b3",
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
  },
};

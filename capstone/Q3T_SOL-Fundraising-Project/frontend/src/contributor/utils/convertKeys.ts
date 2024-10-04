import bs58 from "bs58"; // Import bs58 properly

export const convertWallet = (secretKeyArray: any): string => {
    const base58PrivateKey = bs58.encode(secretKeyArray); // Use bs58.encode()
    return base58PrivateKey;
}


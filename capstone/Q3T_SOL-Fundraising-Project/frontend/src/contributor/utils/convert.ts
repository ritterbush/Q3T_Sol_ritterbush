import * as anchor from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


export default function convertKey (anchorKeypair: any){
    const anchorKey= anchor.web3.Keypair.generate();
    // Get the secret key (this includes both private and public keys in a 64-byte array)
const fullSecretKey = anchorKey.secretKey;

// Extract the first 32 bytes (the private key portion)
const privateKeyArray = fullSecretKey.slice(0, 32);

// Convert to Base58 (Phantom format)
const phantomPrivateKey = bs58.encode(privateKeyArray);

console.log("Phantom-compatible Private Key:", phantomPrivateKey);
} 

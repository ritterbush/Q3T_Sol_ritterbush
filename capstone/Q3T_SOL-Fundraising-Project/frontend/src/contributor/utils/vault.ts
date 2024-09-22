import * as anchor from "@coral-xyz/anchor";
import VaultWallet from './vault.json'
import { SystemProgram, } from "@solana/web3.js";

export default async function initializeVault(provider: any) {
    const vaultKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(VaultWallet));
  
    console.log(vaultKeypair.secretKey);
  
    // Define the public key of the vault
    const vaultPublicKey = vaultKeypair.publicKey;
  
    // Transaction to create the vault and fund it with some initial SOL (e.g., 1 SOL)
    const transaction = new anchor.web3.Transaction().add(
      // Create an account with a specific amount of SOL
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey, // Fund the account from your wallet
        newAccountPubkey: vaultPublicKey, // The vault's public key
        lamports: anchor.web3.LAMPORTS_PER_SOL, // Initial amount of SOL (e.g., 1 SOL)
        space: 0, // No space needed for a system account
        programId: SystemProgram.programId, // System program
      })
    );
  
    const tx = await provider.sendAndConfirm(transaction, [vaultKeypair]);
    console.log("vault --------------------------------")
    console.log(tx);
  }
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, } from "@solana/web3.js";
import IDL from "./capstone.json";
import { Buffer } from "buffer";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default async function initialize(
  connectedPublicKey: PublicKey,
  provider: any,
  baseAccount: any,
  campaignDeadline: string,
  campaignAmount: number
) {

  const generate = JSON.stringify(IDL);
  const b = JSON.parse(generate);
  const program = new Program(b, provider);

  const fundraiser = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("fundraiser"), baseAccount.publicKey.toBuffer()],
    program.programId
  )[0];

  const confirm = async (signature: string): Promise<string> => {
    const block = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      signature,
      ...block,
    });
    console.log(signature);
    return signature;
  };

  const initialize = async () => {
    const deadline = Math.floor(new Date(campaignDeadline).getTime() / 1000);
    const initInstruction = await program.methods
      .initialize(new anchor.BN(campaignAmount * 1000000000), new anchor.BN(deadline))
      .accountsPartial({
        maker: baseAccount.publicKey, // baseAccount as maker
        fundraiser: fundraiser,
        // vault: vaultKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction(); // Make sure to await this

    // Create a new transaction and add the awaited instruction
    const transaction = new anchor.web3.Transaction().add(initInstruction);

    const { blockhash } = await provider.connection.getLatestBlockhash();

    // Set the recent blockhash in the transaction
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.wallet.publicKey;

    try {
      const signature = await provider.sendAndConfirm(transaction, [baseAccount]).then(confirm); // baseAccount passed as signer
      console.log("Transaction sent with signature:", signature);
      return signature;
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  
  return initialize();
}

import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@coral-xyz/anchor"
import { IDL, CapstoneTest1 } from "./programs/capstone_test_1";
import wallet from "./dev-wallet-cohort-application.json";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<CapstoneTest1>(IDL, provider);

(async () => {
  try {
      const txhash = await program.methods
      .initialize()
      .accounts({
          user: keypair.publicKey,
      })
      .signers([
          keypair
      ]).rpc();
      console.log(`Success! Check out your TX here: 
      https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch(e) {
      console.error(`Oops, something went wrong: ${e}`)
  }
})();

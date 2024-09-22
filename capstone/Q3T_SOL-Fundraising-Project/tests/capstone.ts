import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { randomBytes } from "crypto"
import { Capstone } from "../target/types/capstone";

describe("capstone", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Capstone as Program<Capstone>;
  const provider = anchor.getProvider();
  const connection = provider.connection;

  // https://www.unixtimestamp.com
  // Current unix timestamp in seconds
  let currentTime = 1726221524;
  // +1 hour
  let secondsFromNow = 3600;
  let deadline = new BN(currentTime + secondsFromNow);

  let maker = new Keypair();
  // contributers
  let c1 = new Keypair();
  let c2 = new Keypair();

  // contributor amounts to donate
  let c1Amt = new BN(30);
  let c2Amt = new BN(20);

  let amount = new BN(LAMPORTS_PER_SOL).mul(new BN(20));
  let seed = new BN(randomBytes(16));
  //let fundraiser = PublicKey.findProgramAddressSync([Buffer.from("fundraiser"), maker.publicKey.toBuffer(), seed.toBuffer("le", 16)], program.programId)[0];
  let fundraiser = PublicKey.findProgramAddressSync([Buffer.from("fundraiser"), maker.publicKey.toBuffer()], program.programId)[0];

  let c1Acct = PublicKey.findProgramAddressSync([Buffer.from("contributor"), fundraiser.toBuffer(), c1.publicKey.toBuffer()], program.programId)[0];
  let c2Acct = PublicKey.findProgramAddressSync([Buffer.from("contributor"), fundraiser.toBuffer(), c2.publicKey.toBuffer()], program.programId)[0];

  //let airdropAmt = new BN(100 * anchor.web3.LAMPORTS_PER_SOL);

  it("Airdrop", async () => {
    await Promise.all([maker, c1, c2].map(async (k) => {
      return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL).then(confirmTx)
    }));
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(amount, deadline)
      .accountsPartial({
        maker: maker.publicKey,
        fundraiser: fundraiser,
        systemProgram: SystemProgram.programId,
      })
      .signers([
        maker
      ]).rpc().then(confirmTx);

      console.log("Your transaction signature", tx);
  });

  it("Donor 1 Donated!", async () => {
    // Add your test here.

    const tx = await program.methods
      .contribute(c1Amt)
      .accountsPartial({
        contributor: c1.publicKey,
        fundraiser: fundraiser,
        contributorAccount: c1Acct,
        systemProgram:SystemProgram.programId,
      })
      .signers([
        c1
      ]).rpc().then(confirmTx);

      console.log("Your transaction signature", tx);
  });

  it("Donor 2 Donated!", async () => {
    // Add your test here.

    const tx = await program.methods
      .contribute(c2Amt)
      .accountsPartial({
        contributor: c2.publicKey,
        fundraiser: fundraiser,
        contributorAccount: c2Acct,
        systemProgram:SystemProgram.programId,
      })
      .signers([
        c2
      ]).rpc().then(confirmTx);

      console.log("Your transaction signature", tx);
  });

  it("Check Contributions: Deadline is not up!", async () => {
    // Add your test here.

    const tx = await program.methods
      .checkContributions()
      .accountsPartial({
        maker: maker.publicKey,
        fundraiser: fundraiser,
        systemProgram:SystemProgram.programId,
      })
      .signers([
        maker
      ]).rpc().then(confirmTx);

      console.log("Your transaction signature", tx);
  });

  it("Refund Donor 1: Deadline is not up!", async () => {
    // Add your test here.

    const tx = await program.methods
      .refund()
      .accountsPartial({
        contributor: c1.publicKey,
        maker: maker.publicKey,
        fundraiser: fundraiser,
        contributorAccount: c1Acct,
        systemProgram:SystemProgram.programId,
      })
      .signers([
        c1
      ]).rpc().then(confirmTx);

      console.log("Your transaction signature", tx);
  });

  it("Refund Donor 2: Deadline is not up!", async () => {
    // Add your test here.

    const tx = await program.methods
      .refund()
      .accountsPartial({
        contributor: c2.publicKey,
        maker: maker.publicKey,
        fundraiser: fundraiser,
        contributorAccount: c2Acct,
        systemProgram:SystemProgram.programId,
      })
      .signers([
        c2
      ]).rpc().then(confirmTx);

      console.log("Your transaction signature", tx);
  });

  const confirmTx = async (signature: string): Promise<string> => {
    const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
    await anchor.getProvider().connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      "confirmed"
    )
    return signature
  }

});

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GmSolana } from "../target/types/gm_solana";

describe("gm-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.GmSolana as Program<GmSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
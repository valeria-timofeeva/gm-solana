import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GmSolana } from "../target/types/gm_solana";
import assert from "assert";

const { SystemProgram } = anchor.web3;

describe("gm-solana", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GmSolana as Program<GmSolana>;
  let _baseAccount: anchor.web3.Keypair;

  it("creates a base account for gm's", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );

    assert.equal(account.gmCount.toString(), "0");
    _baseAccount = baseAccount;
  });

  it("receives and saves a gm message",async () => {
    const message = "gm wagmi";
    const user = provider.wallet.publicKey;
    
    const accountBefore = await program.account.baseAccount.fetch(
      _baseAccount.publicKey
    );
    const gmCountBefore = accountBefore.gmCount;

    const tx = await program.rpc.sayGm(message, {
      accounts: {
        baseAccount: _baseAccount.publicKey,
        user,
      },
    });

    const accountAfter = await program.account.baseAccount. fetch(
      _baseAccount.publicKey
    );

    const gmCountAfter = accountAfter.gmCount;
    assert.equal(gmCountAfter.sub(gmCountBefore).toString(), "1");

    const gmList = accountAfter.gmList;
    assert.equal(gmList[0].message, message);
    assert.equal(gmList[0].user.equals(user), true);
    assert.equal(gmList[0].timestamp.gt(new anchor.BN(0)),true);
  });
});

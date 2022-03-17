use anchor_lang::prelude::*;

declare_id!("FsVne7rYcGPKysLvuTzFz1D9mD8iu7QGxEL8xFFypGU9");

#[program]
pub mod gm_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.gm_count = 0;

        Ok(())
    }

    pub fn say_gm(ctx: Context<SayGm>, message: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let message = message.clone();
        let timestamp = Clock::get().unwrap().unix_timestamp;
        let user = *ctx.accounts.user.to_account_info().key;
        let gm = GmMessage {
            user,
            message,
            timestamp,
        };
        base_account.gm_list.push(gm);
        base_account.gm_count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 64 + 1024)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BaseAccount {
    pub gm_count: u64,
    pub gm_list: Vec<GmMessage>,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct GmMessage {
    pub user: Pubkey,
    pub message: String,
    pub timestamp: i64,
}

#[derive(Accounts)]
pub struct SayGm<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    pub user: Signer<'info>,
}

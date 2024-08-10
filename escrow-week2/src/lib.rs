use anchor_lang::prelude::*;

declare_id!("4eevBsME5eynje9YwHNtZwBwiWqsZ4nqSptztMKF5PTa");

pub mod state;
pub use state::*;

pub mod instructions;
pub use instructions::*;

#[program]
pub mod escrow_week2 {
    use super::*;

    pub fn initialize(ctx: Context<Make>, seed: u64, receive: u64, deposit: u64) -> Result<()> {
        ctx.accounts.init_escrow(seed, receive, &ctx.bumps)?;
        ctx.accounts.deposit(deposit)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

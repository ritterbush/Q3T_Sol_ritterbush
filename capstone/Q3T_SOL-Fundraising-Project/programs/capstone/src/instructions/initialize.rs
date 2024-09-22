use anchor_lang::prelude::*;

use crate::{
    state::Fundraiser, FundraiserError, ANCHOR_DISCRIMINATOR
};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        init,
        payer = maker,
        seeds = [b"fundraiser", maker.key().as_ref()],
        bump,
        space = ANCHOR_DISCRIMINATOR + Fundraiser::INIT_SPACE,
    )]
    pub fundraiser: Account<'info, Fundraiser>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, amount: u64, deadline_: i64, bumps: &InitializeBumps) -> Result<()> {

        // Check if the fundraising duration has been reached
        let current_time = Clock::get()?.unix_timestamp;
 
        require!(
            deadline_ > current_time,
            FundraiserError::DeadlinePast
        );

        // Initialize the fundraiser account
        self.fundraiser.set_inner(Fundraiser {
            maker: self.maker.key(),
            amount_to_raise: amount,
            current_amount: 0,
            deadline: deadline_,
            bump: bumps.fundraiser,
        });

        Ok(())
    }
}

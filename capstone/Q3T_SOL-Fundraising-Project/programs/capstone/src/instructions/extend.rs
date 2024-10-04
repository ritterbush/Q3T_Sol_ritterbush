use anchor_lang::prelude::*;

use crate::{
    state::Fundraiser, FundraiserError, MAX_EXTENSIONS, DEADLINE_EXTENSION_AMT,
};

#[derive(Accounts)]
pub struct Extend<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        mut,
        seeds = [b"fundraiser", maker.key().as_ref()],
        bump,
    )]
    pub fundraiser: Account<'info, Fundraiser>,
    pub system_program: Program<'info, System>,
}

impl<'info> Extend<'info> {
    pub fn extend_deadline(&mut self) -> Result<()> {

        // Check that fundraiser deadline has not been reached
        let current_time = Clock::get()?.unix_timestamp;
 
        require!(
            self.fundraiser.deadline > current_time,
            FundraiserError::FundraiserEnded
        );

        // Check that the target amount has not been met
        require!(
            self.fundraiser.current_amount < self.fundraiser.amount_to_raise,
            FundraiserError::TargetMet
        );

        // Check that the max amount of extensions has not been reached
        require!(
            self.fundraiser.extensions < MAX_EXTENSIONS,
            FundraiserError::MaxExtensionsReached
        );

        let extensions_amt = self.fundraiser.extensions + 1;
        let new_deadline = self.fundraiser.deadline + DEADLINE_EXTENSION_AMT;

        // Update deadline and extensions in the fundraiser account
        self.fundraiser.deadline = new_deadline;
        self.fundraiser.extensions = extensions_amt;

        Ok(())
    }
}

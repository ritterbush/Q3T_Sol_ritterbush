use std::str::FromStr;
use anchor_lang::prelude::*;

use crate::{
    state::Fundraiser,
    FundraiserError,
    FEES_PERCENTAGE,
    MAINNET,
    MAINNET_FEES_WALLET,
    DEVNET_FEES_WALLET,
};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because pubKey gets checked
    pub fee_collector: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"fundraiser".as_ref(), maker.key().as_ref()],
        bump = fundraiser.bump,
        close = maker,
    )]
    pub fundraiser: Account<'info, Fundraiser>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(&self) -> Result<()> {

        // Check that fundraising deadline has been passed
        let current_time = Clock::get()?.unix_timestamp;
 
        require!(
            self.fundraiser.deadline <= current_time,
            FundraiserError::FundraiserNotEnded
        );

        let wallet_collect_fees_key = Pubkey::from_str(if MAINNET {MAINNET_FEES_WALLET} else {DEVNET_FEES_WALLET}).unwrap();

        // Check our pubKey is the same as the fee_collector's pubKey
        require_keys_eq!(
            self.fee_collector.key(),
            wallet_collect_fees_key,
        );

        let fees_amt: u64 = (self.fundraiser.get_lamports() * FEES_PERCENTAGE as u64).div_ceil(100 as u64);

        // Tranfer fees from PDA to fee_collector
        self.fundraiser.sub_lamports(fees_amt)?;
        self.fee_collector.add_lamports(fees_amt)?;

        // Simply close the fundraiser account and send all lamports to the maker
        self.fundraiser.close(self.maker.to_account_info())?;

        Ok(())
    }
}

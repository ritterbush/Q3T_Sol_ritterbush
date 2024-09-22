use std::str::FromStr;
use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

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

        // Check that the target amount has been met
        require!(
            self.fundraiser.current_amount >= self.fundraiser.amount_to_raise,
            FundraiserError::TargetNotMet
        );

        let wallet_collect_fees_key = Pubkey::from_str(if MAINNET {MAINNET_FEES_WALLET} else {DEVNET_FEES_WALLET}).unwrap();

        // Check our pubKey is the same as the fee_collector's pubKey
        require_keys_eq!(
            self.fee_collector.key(),
            wallet_collect_fees_key,
        );

        let fees_amt: u64 = (self.fundraiser.get_lamports() * 100 as u64).div_euclid(FEES_PERCENTAGE as u64);

        // Collect fee then transfer the funds to the maker
        let cpi_program = self.system_program.to_account_info();

        // Transfer the fees from the fundraiser to the fees wallet
        let cpi_accounts = Transfer {
            from: self.fundraiser.to_account_info(),
            to: self.fee_collector.to_account_info(),
        };

        // Signer seeds to sign the CPI on behalf of the fundraiser account
        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"fundraiser".as_ref(),
            self.maker.to_account_info().key.as_ref(),
            &[self.fundraiser.bump],
        ]];

        // CPI context with signer since the fundraiser account is a PDA
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer_seeds);

        // Transfer the funds from the vault to the maker
        transfer(cpi_ctx, fees_amt)?;


        // Transfer the funds from the fundraiser to the maker
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.fundraiser.to_account_info(),
            to: self.maker.to_account_info(),
        };

        // Signer seeds to sign the CPI on behalf of the fundraiser account
        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"fundraiser".as_ref(),
            self.maker.to_account_info().key.as_ref(),
            &[self.fundraiser.bump],
        ]];

        // CPI context with signer since the fundraiser account is a PDA
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer_seeds);

        // Transfer the funds from the vault to the maker
        transfer(cpi_ctx, self.fundraiser.get_lamports())?;

        Ok(())
    }
}

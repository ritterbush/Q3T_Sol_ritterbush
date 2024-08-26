use anchor_lang::prelude::*;
use anchor_spl::{token::Token, token_interface::Mint};

use crate::state::Marketplace;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = Marketplace::LEN,
        seeds = [b"marketplace", name.as_str().as_bytes()],
        bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        payer = admin,
        mint::decimals = 6,
        mint::authority = marketplace,
    )]
    rewards: Account<'info, Mint>,
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn init(&mut self, bumps: &InitializeBumps, name: String, fee: u16) -> Result<()> {
        require!(name.len() > 3 && name.len() < 33, MarketplaceNameError::DataTooLarge);
        self.marketplace.admin = self.admin.key();
        self.marketplace.fee = fee;
        self.marketplace.name = name;
        self.marketplace.bump = bumps.marketplace;
        self.marketplace.treasury_bump = bumps.treasury;
        Ok(())
    }
}

#[error_code]
pub enum MarketplaceNameError {
    #[msg("Keep name between 3 and 33 chars.")]
    DataTooLarge
}


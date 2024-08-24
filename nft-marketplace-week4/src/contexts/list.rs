use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::state::{Marketplace, Whitelist, Listing};

#[derive(Accounts)]
pub struct List<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        mut,
        associated_token::authority = maker,
        associated_token::mint = maker_mint,
    )]
    pub maker_ata: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = maker,
        seeds = [b"auth", maker_mint.key().as_ref()],
        bump,
        token::authority = vault,
        token::mint = maker_mint,
    )]

    pub vault: Account<'info, TokenAccount>,
    pub maker_mint: Account<'info, Mint>,
    pub collection_mint: Account<'info, Mint>,
    #[account(
        seeds = [marketplace.key().as_ref(), collection_mint.key()],
        bump = whitelist.bump,
    )]
    pub whitelist: Account<'info, Whitelist>,
    #[account(
        init,
        payer = maker,
        space = Listing::LEN,
        seeds = [whitelist.key().as_ref(), maker_mint.key().as_ref()],
        bump,
    )]
    pub listing: Account<'info, Listing>,
    #[account(
        seeds = [
            b"metadata",
            metadata.program.key().as_ref(),
            maker_mint.key().as_ref(),
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub metadata: Account<'info, MetadataAccount>,
    pub metadata_program: Program<'info, Metadata>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> List<'info> {
}

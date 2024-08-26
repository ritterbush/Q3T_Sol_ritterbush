use anchor_lang::prelude::*;
mod state;
mod contexts;
mod error;
use contexts::*;
use error::*;

declare_id!("58nAdUhAaZw1cdBh3xyupY6FdqrBXnA8QqejsCGNjABC");

#[program]
pub mod nft_marketplace_week4 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()> {
        ctx.accounts.init(&ctx.bumps, name, fee)
    }

    pub fn whitelist_collection(ctx: Context<WhitelistCollection>) -> Result<()> {
        unimplemented!()
    }

    pub fn list(ctx: Context<List>, price: u64) -> Result<()> {
        ctx.accounts.create_listing(&ctx.bumps, price)?;
        ctx.accounts.deposit_nft()
    }

    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        unimplemented!()
    }

    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        unimplemented!()
    }
}

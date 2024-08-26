use anchor_lang::prelude::*;

#[account]
pub struct Marketplace {
    pub admin: Pubkey,
    pub fee: u16,
    pub bump: u8,
    pub treasury_bump: u8,
    pub name: String,
}

// at the end it is 4 for String, and 32 for 32 chars it can have
impl Marketplace {
    pub const LEN: usize = 8 + 32 + 2 + 1 + 1 + 4 + 32;
}

#[account]
pub struct Whitelist {
    pub bump: u8,
}

impl Whitelist {
    pub const LEN: usize = 8 + 1;
}

#[account]
pub struct Listing {
    pub maker: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub bump: u8,
    pub auth_bump: u8,
}

impl Listing {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1 + 1;
}


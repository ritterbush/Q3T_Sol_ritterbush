use anchor_lang::error_code;

#[error_code]
pub enum FundraiserError {
    #[msg("This fundraiser does not allow refunds")]
    RefundsDisabled,
    #[msg("The deadline must be in the future")]
    DeadlinePast,
    #[msg("The amount to raise has not been met")]
    TargetNotMet,
    #[msg("The amount to raise has been achieved")]
    TargetMet,
    #[msg("The fundraiser has not ended yet")]
    FundraiserNotEnded,
    #[msg("The fundraiser has ended")]
    FundraiserEnded,
    #[msg("The maximum number of deadline extensions has been reached")]
    MaxExtensionsReached,
}

use anchor_lang::error_code;

#[error_code]
pub enum CustomError {
    #[msg("Keep name between 3 and 33 chars.")]
    CustomError,
}

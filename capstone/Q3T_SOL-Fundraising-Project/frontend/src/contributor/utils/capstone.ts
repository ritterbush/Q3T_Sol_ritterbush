/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/capstone.json`.
 */
export type Capstone = {
  "address": "CEsmX47xiPVyeaBcH6mmgkwGNQhU77Xwim7mSTez5cK4",
  "metadata": {
    "name": "capstone",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "contribute",
      "discriminator": [
        82,
        33,
        68,
        131,
        32,
        0,
        205,
        95
      ],
      "accounts": [
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundraiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  114,
                  97,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "fundraiser.maker",
                "account": "fundraiser"
              }
            ]
          }
        },
        {
          "name": "contributorAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "fundraiser"
              },
              {
                "kind": "account",
                "path": "contributor"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundraiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  114,
                  97,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "i64"
        }
      ]
    },
    {
      "name": "refund",
      "discriminator": [
        2,
        96,
        183,
        251,
        63,
        208,
        46,
        46
      ],
      "accounts": [
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "maker"
        },
        {
          "name": "fundraiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  114,
                  97,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              }
            ]
          }
        },
        {
          "name": "contributorAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  105,
                  98,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "fundraiser"
              },
              {
                "kind": "account",
                "path": "contributor"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "maker",
          "writable": true,
          "signer": true
        },
        {
          "name": "feeCollector",
          "writable": true
        },
        {
          "name": "fundraiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  117,
                  110,
                  100,
                  114,
                  97,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "maker"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contributor",
      "discriminator": [
        222,
        222,
        255,
        212,
        133,
        49,
        27,
        93
      ]
    },
    {
      "name": "fundraiser",
      "discriminator": [
        167,
        106,
        143,
        202,
        135,
        131,
        204,
        196
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "refundsDisabled",
      "msg": "This fundraiser does not allow refunds"
    },
    {
      "code": 6001,
      "name": "deadlinePast",
      "msg": "The deadline must be in the future"
    },
    {
      "code": 6002,
      "name": "targetNotMet",
      "msg": "The amount to raise has not been met"
    },
    {
      "code": 6003,
      "name": "targetMet",
      "msg": "The amount to raise has been achieved"
    },
    {
      "code": 6004,
      "name": "fundraiserNotEnded",
      "msg": "The fundraiser has not ended yet"
    },
    {
      "code": 6005,
      "name": "fundraiserEnded",
      "msg": "The fundraiser has ended"
    }
  ],
  "types": [
    {
      "name": "contributor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fundraiser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maker",
            "type": "pubkey"
          },
          {
            "name": "amountToRaise",
            "type": "u64"
          },
          {
            "name": "currentAmount",
            "type": "u64"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

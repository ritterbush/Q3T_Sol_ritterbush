import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

         const image = "https://arweave.net/2UakdcU1BAfvUEcVja-D2dVgq_Iww3p-9ANSG5iUiwI";
         const metadata = {
             name: "Rug McRugface",
             symbol: "RMcR",
             description: "Can't rug; won't rug.",
             image: image,
             attributes: [
                 {trait_type: 'magic', value: 'true'},
                 {trait_type: 'color', value: 'purple'},
             ],
             properties: {
                 files: [
                     {
                         type: "image/png",
                         uri: image,
                     },
                 ]
             },
             creators: [keypair.publicKey]
         };
         const myUri = await umi.uploader.uploadJson(metadata);
         console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

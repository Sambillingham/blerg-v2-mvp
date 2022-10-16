const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {

    const { message, address, signedMessage } = req.body

    console.log('address', address)
    console.log('zigned Message',signedMessage)
    console.log('m',message)

    // const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    const data = message.split(':');
    const blergId = data[1]
    const traits = data.slice(2,7).join('')


    const blerg = await supabase
        .from('blerg')
        .update({ traits: traits})
        .eq('blergId', blergId)

    console.log('BLERG DB RES', blerg)

    if (!blerg.error) {
        res.status(200).json( { success: true })
    } else {
        res.status(500).json( { success: false })
    }
    

}

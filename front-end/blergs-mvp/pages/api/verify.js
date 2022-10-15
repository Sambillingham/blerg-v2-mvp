
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {

    
    const { message, address, signedMessage }  = JSON.parse(event.body);
    console.log(address)
    console.log(signedMessage)
    console.log(message)

    const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    const data = message.split(':');
    const blergId = data[1]
    const traits = data.slice(2,7).join()
    console.log('traits', traits)

    const blerg = await supabase
        .from('blerg')
        .update({ 
            traits: traits
        })
        .eq('blergId', blergId)
        .single()
    
    if (blerg.data) {
        return {
            statusCode: 200,
            body: JSON.stringify({success: true})
        }   
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({success: false})
        }   
    }
    

}

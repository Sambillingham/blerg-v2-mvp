

import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {

    
    const { blergId, traits}  = JSON.parse(event.body);

    console.log(blergId, traits)
    const blerg = await supabase
        .from('blerg')
        .insert({ 
            traits: traits,
            blergId: blergId,
        })
    
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

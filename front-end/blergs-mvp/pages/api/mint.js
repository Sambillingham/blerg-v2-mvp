const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {
    
    const { blergId, traits}  = req.body

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

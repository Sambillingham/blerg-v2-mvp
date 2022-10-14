import 'dotenv/config';
const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

exports.handler = async (event, context, callback) => {
    const {id} = JSON.parse(event.body);
    
    const ref = await supabase
        .from('blerg')
        .select()
        .eq('blergId', id)
    
    return {
        statusCode: 200,
        body: JSON.stringify({ traits: ref.data[0].traits })
    }   
}

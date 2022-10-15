const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {
  const { id } = req.query

  const ref = await supabase
      .from('blerg')
      .select()
      .eq('blergId', id)
      .single()
  
  const attributes = ref.data.traits.split('').map(x => {
    return { trait_value: x }
  })
  
  res.status(200).json({
    "name": `Blerg #${id}`,
    id,
    "description": `Friendly Blerg Information `, 
    "external_url": `https://blergaversev2.io/${id}`, 
    "image": "placeholder", 
    attributes,
  });
}


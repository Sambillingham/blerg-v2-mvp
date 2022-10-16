
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
  
    const attributes = ref.data.traits.split('');
    // console.log(attributes)
    const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#CBD6DD"/>
    <rect x="10.5" y="11.5" width="378" height="378" fill="#D2D2D2" stroke="#5390EC" stroke-width="3" stroke-dasharray="1 2"/>
    <rect x="42.5" y="42.5" width="315" height="70" fill="#D7DBE7" stroke="#5390EC" stroke-width="3" stroke-dasharray="1 2"/>
    <rect x="42.5" y="124.5" width="315" height="70" fill="#D7DBE7" stroke="#5390EC" stroke-width="3" stroke-dasharray="1 2"/>
    <rect x="42.5" y="288.5" width="315" height="70" fill="#D7DBE7" stroke="#5390EC" stroke-width="3" stroke-dasharray="1 2"/>
    <rect x="42.5" y="206.5" width="315" height="70" fill="#D7DBE7" stroke="#5390EC" stroke-width="3" stroke-dasharray="1 2"/>
    <text fill="#5E81FF" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="16" font-weight="bold" letter-spacing="0em"><tspan x="369" y="378.258">${attributes[4]}</tspan></text>
    <text fill="#5E81FF" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="16" font-weight="bold" letter-spacing="0em"><tspan x="195" y="81.2578">${attributes[0]}</tspan></text>
    <text fill="#5E81FF" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="16" font-weight="bold" letter-spacing="0em"><tspan x="195" y="328.258">${attributes[3]}</tspan></text>
    <text fill="#5E81FF" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="16" font-weight="bold" letter-spacing="0em"><tspan x="195" y="246.258">${attributes[2]}</tspan></text>
    <text fill="#5E81FF" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="16" font-weight="bold" letter-spacing="0em"><tspan x="195" y="163.258">${attributes[1]}</tspan></text>
    </svg>
    
    `
    res.statusCode = 200
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/svg+xml");
    return res.end(svg)
}







export default async function handler(req, res) {
  const { id } = req.query
  const response = await fetch('http://dancing-capybara-b2f749.netlify.app/.netlify/functions/get', {
      method: 'POST',
      cache: 'no-cache',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id,
      }) 
  })
  const json = await response.json();

  res.status(200).json({ 
    id,
    title: `Blerg ${id}`,
    traits: `${json.traits}` 
  });
}

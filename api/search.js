export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nicho, loc, stars, revs, filtroSite, qtd } = req.body;
  if (!nicho || !loc) return res.status(400).json({ error: 'Parâmetros inválidos' });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Google API Key não configurada' });

  const quantidade = parseInt(qtd) || 20;
  const minStars = parseFloat(stars) || 3.5;
  const minRevs = parseInt(revs) || 5;

  try {
    // Google Places Text Search
    const query = `${nicho} em ${loc}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=pt-BR&key=${apiKey}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ 
        error: `Erro Google Places: ${searchData.status}`,
        detail: searchData.error_message || ''
      });
    }

    if (!searchData.results?.length) {
      return res.status(200).json({ leads: [], message: 'Nenhum negócio encontrado.' });
    }

    // Pega até 2x a quantidade pedida para ter margem após filtros
    const places = searchData.results.slice(0, Math.min(quantidade * 2, 40));
    const leadsRaw = [];

    // Busca detalhes em paralelo
    await Promise.all(places.map(async (place) => {
      try {
        const rating = place.rating || 0;
        const userRatings = place.user_ratings_total || 0;

        // Filtro de avaliação e reviews
        if (rating < minStars || userRatings < minRevs) return;

        // Detalhes do lugar
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total&language=pt-BR&key=${apiKey}`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        const d = detailData.result || {};

        // Verifica site próprio (redes sociais não contam)
        const temSite = !!(d.website &&
          !d.website.includes('facebook.com') &&
          !d.website.includes('instagram.com') &&
          !d.website.includes('tiktok.com') &&
          !d.website.includes('twitter.com') &&
          !d.website.includes('google.com'));

        // Aplica filtro de site
        if (filtroSite === 'sem' && temSite) return;
        if (filtroSite === 'com' && !temSite) return;

        leadsRaw.push({
          nome: d.name || place.name,
          endereco: d.formatted_address || place.formatted_address || '',
          telefone: d.formatted_phone_number || '',
          avaliacao: d.rating || rating,
          reviews: d.user_ratings_total || userRatings,
          tem_site: temSite
        });
      } catch (e) {
        // ignora erros individuais
      }
    }));

    const leads = leadsRaw.slice(0, quantidade);

    if (!leads.length) {
      return res.status(200).json({ leads: [], message: 'Nenhum lead encontrado com esses filtros. Tente reduzir os filtros.' });
    }

    return res.status(200).json({ leads });

  } catch (err) {
    return res.status(500).json({ error: 'Erro: ' + err.message });
  }
}

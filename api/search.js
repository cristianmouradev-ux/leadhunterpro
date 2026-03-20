export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nicho, loc, cidade, estado, pais, stars, revs, filtroSite, msg } = req.body;
  if (!nicho || !loc) return res.status(400).json({ error: 'Parâmetros inválidos' });

  const filtroLabel =
    filtroSite === 'sem' ? 'APENAS negócios SEM site próprio' :
    filtroSite === 'com' ? 'APENAS negócios COM site' : 'todos';

  const prompt = `Você é um especialista em prospecção B2B. Busque negócios reais do nicho "${nicho}" em ${loc}.

Filtros obrigatórios: avaliação mínima ${stars} estrelas, mínimo ${revs} reviews. Mostrar: ${filtroLabel}.

Use web_search para buscar "${nicho} ${loc}" e encontrar negócios reais com endereço, telefone e avaliações do Google Maps.

Para cada negócio encontrado, verifique se possui site próprio (Facebook, Instagram, TikTok e Google Perfil NÃO contam como site).

Retorne APENAS um JSON válido, sem texto adicional, sem markdown, sem backticks:
{
  "leads": [
    {
      "nome": "Nome do negócio",
      "endereco": "Endereço completo com bairro e cidade",
      "telefone": "+55 54 99999-9999",
      "avaliacao": 4.5,
      "reviews": 123,
      "tem_site": false
    }
  ]
}

Busque o MÁXIMO de negócios possível — mínimo 15 se existirem. APENAS o JSON, nada mais.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.error?.message || 'Erro na API Anthropic' });
    }

    const data = await response.json();
    let rawText = '';
    for (const block of data.content || []) {
      if (block.type === 'text') rawText += block.text;
    }

    rawText = rawText.trim();
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ error: 'Resposta inválida da IA. Tente novamente.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    } catch {
      return res.status(500).json({ error: 'Erro ao processar resposta. Tente novamente.' });
    }

    const leads = parsed.leads || [];
    if (!leads.length) {
      return res.status(200).json({ leads: [], message: 'Nenhum lead encontrado para esse nicho e localização.' });
    }

    return res.status(200).json({ leads });
  } catch (err) {
    return res.status(500).json({ error: 'Erro de conexão: ' + err.message });
  }
}

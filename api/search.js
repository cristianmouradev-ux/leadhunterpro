export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nicho, loc, stars, revs, filtroSite, qtd } = req.body;
  if (!nicho || !loc) return res.status(400).json({ error: 'Parâmetros inválidos' });

  const filtroLabel =
    filtroSite === 'sem' ? 'SEM site próprio' :
    filtroSite === 'com' ? 'COM site' : 'todos';

  const quantidade = parseInt(qtd) || 20;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: 'Você é uma API que retorna APENAS JSON válido. Nunca escreva texto fora do JSON. Nunca use markdown. Sua resposta começa com { e termina com }.',
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{
          role: 'user',
          content: `Use web_search para encontrar negócios de "${nicho}" em ${loc}. Filtros: avaliação >= ${stars} estrelas, reviews >= ${revs}, mostrar ${filtroLabel}. Facebook/Instagram/TikTok NÃO são sites. Traga até ${quantidade} resultados. Retorne APENAS este JSON:
{"leads":[{"nome":"string","endereco":"string","telefone":"+55 XX XXXXX-XXXX","avaliacao":4.5,"reviews":100,"tem_site":false}]}`
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.error?.message || 'Erro na API' });
    }

    const data = await response.json();
    let rawText = '';
    for (const block of data.content || []) {
      if (block.type === 'text') rawText += block.text;
    }

    rawText = rawText.trim().replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ error: 'Nenhum resultado. Tente novamente.', debug: rawText.slice(0, 200) });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    } catch {
      return res.status(500).json({ error: 'Erro ao processar. Tente novamente.' });
    }

    const leads = parsed.leads || [];
    if (!leads.length) {
      return res.status(200).json({ leads: [], message: 'Nenhum lead encontrado.' });
    }

    return res.status(200).json({ leads });

  } catch (err) {
    return res.status(500).json({ error: 'Erro: ' + err.message });
  }
}

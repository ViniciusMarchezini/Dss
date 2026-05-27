import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON File Database Setup for Leads & Candidates
const LEADS_FILE_PATH = path.join(process.cwd(), "leads.json");
const CANDIDATES_FILE_PATH = path.join(process.cwd(), "candidates.json");

const ALLOWED_ADMINS = [
  "vinicius@dssproducoes.com.br", 
  "denilson@dssproducoes.com.br", 
  "deivison.santos.consultor@gmail.com",
  "viniciusmarchezini2021@gmail.com", 
  "marchezini.consultor@gmail.com",
  "marcehzini.consultor@gmail.com"
];

function cleanExpiredLeads(leads: any[]): any[] {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let changed = false;

  const activeLeads = leads.filter(l => {
    if (l.timestamp) {
      if (now - l.timestamp > ONE_WEEK_MS) {
        changed = true;
        return false;
      }
      return true;
    }
    
    // Parse DD/MM/YYYY text when timestamp is absent
    if (l.date && typeof l.date === "string") {
      const match = l.date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);
        const dateObj = new Date(year, month, day);
        if (now - dateObj.getTime() > ONE_WEEK_MS) {
          changed = true;
          return false;
        }
      }
    }
    return true;
  });

  if (changed) {
    try {
      fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(activeLeads, null, 2), "utf-8");
    } catch (err) {
      console.error("Erro escrevendo leads limpos de 1 semana:", err);
    }
  }

  return activeLeads;
}

function readLeads(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const data = fs.readFileSync(LEADS_FILE_PATH, "utf-8");
      const list = JSON.parse(data || "[]");
      return cleanExpiredLeads(list);
    }
  } catch (err) {
    console.error("Erro lendo leads.json:", err);
  }
  return [];
}

function writeLeads(leads: any[]) {
  try {
    const cleaned = cleanExpiredLeads(leads);
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(cleaned, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro escrevendo leads.json:", err);
  }
}

function readCandidates(): any[] {
  try {
    if (fs.existsSync(CANDIDATES_FILE_PATH)) {
      const data = fs.readFileSync(CANDIDATES_FILE_PATH, "utf-8");
      return JSON.parse(data || "[]");
    }
  } catch (err) {
    console.error("Erro lendo candidates.json:", err);
  }
  return [];
}

function writeCandidates(candidates: any[]) {
  try {
    fs.writeFileSync(CANDIDATES_FILE_PATH, JSON.stringify(candidates, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro escrevendo candidates.json:", err);
  }
}

// Lazy-initialize Google Gen AI Client if key is available
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System settings to define context for the AI
const SYSTEM_INSTRUCTION = `Você é um Consultor de Consórcio de IA altamente qualificado e profissional da DSS Intermediação, uma renomada empresa afiliada autorizada da Ademicon.
Seu objetivo é sanar dúvidas sobre consórcios, ajudar a simular planos e demonstrar as vantagens de escolher a DSS Intermediação e a Ademicon.

Instruções obrigatórias que você deve SEMPRE seguir:
1. A Ademicon possui mais de 30 anos de história (desde 1991) e se consolidou como especialista de consórcios e investimentos e uma das maiores administradoras independentes do Brasil.
2. A DSS Intermediação atua há 14 anos como especialista em consórcios (desde 2012), prestando atendimento inteligente, seguro e focado na realização planejada de sonhos de seus clientes. Sua localização física oficial fica localizada na unidade da Ademicon de São Caetano do Sul (SP).
3. No consórcio Ademicon não existem juros (apenas taxa administrativa fixa de em média 12% a 15% diluída e fundo de reserva, sem juros acumulativos).
4. Explique as facilidades exclusivas da Ademicon:
   - Parcela Facilitada/Reduzida: Oferece opções de pagamento de 50% (Meia Parcela, a mais famosa e usada), 70% ou 85% do valor da parcela mensal cheia até a contemplação por sorteio ou lance. A diferença é diluída de forma inteligente apenas após o recebimento do crédito.
   - Lance Embutido: Permite utilizar até 25% da própria carta de crédito para dar de lance e antecipar sua contemplação de forma planejada sem mexer na sua reserva financeira pessoal.
5. Seja sempre muito cortês, educado, profissional e use termos humanos e reais de planejamento financeiro.
6. Incentive ativamente o usuário a falar com os gestores autorizados da DSS Intermediação para uma reunião de planejamento real. Cite os nomes dos gestores:
   - Denilson Santos (WhatsApp: +55 11 99355-1951)
   - Davison Santos (WhatsApp: +55 11 98280-3557)
7. Responda em Português do Brasil com excelente clareza comercial e didática. Não minta sobre dados ou invente taxas irracionais. Evite termos técnicos incompreensíveis.
8. Se perguntado sobre endereço ou onde a DSS Intermediação está sediada, indique que nosso escritório físico e espaço de atendimento oficial fica especificamente na unidade da Ademicon de São Caetano do Sul (SP).`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DSS Intermediação API running perfectly." });
});

// Admin Authentication check
app.post("/api/admin/check-email", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-mail não informado." });
  }
  if (!password) {
    return res.status(400).json({ error: "Senha não informada." });
  }

  const emailLower = email.toLowerCase().trim();
  const isAuthorized = ALLOWED_ADMINS.includes(emailLower);
  const isPasswordCorrect = password === "Dss139517599";

  if (isAuthorized && isPasswordCorrect) {
    res.json({ authorized: true, email: emailLower });
  } else if (!isAuthorized) {
    res.status(403).json({ error: "Acesso Negado: E-mail não autorizado." });
  } else {
    res.status(451).json({ error: "Acesso Negado: Senha inválida." });
  }
});

// Public Endpoint to submit a simulated and real consolidated lead
app.post("/api/leads", (req, res) => {
  const lead = req.body;
  if (!lead || !lead.name || !lead.phone) {
    return res.status(400).json({ error: "Nome e Telefone são campos obrigatórios." });
  }
  
  // Format dates/IDs consistently
  const newLead = {
    ...lead,
    id: lead.id || Math.random().toString(36).substring(2, 11),
    date: lead.date || new Date().toLocaleString('pt-BR'),
    timestamp: lead.timestamp || Date.now()
  };
  
  const leads = readLeads();
  leads.push(newLead);
  writeLeads(leads);
  res.json({ success: true, lead: newLead });
});

// Public Endpoint to submit a candidate
app.post("/api/candidates", (req, res) => {
  const candidate = req.body;
  if (!candidate || !candidate.name || !candidate.email) {
    return res.status(400).json({ error: "Nome e Email são campos obrigatórios." });
  }
  
  const newCandidate = {
    ...candidate,
    id: candidate.id || Math.random().toString(36).substring(2, 11),
    date: candidate.date || new Date().toLocaleString('pt-BR')
  };
  
  const candidates = readCandidates();
  candidates.push(newCandidate);
  writeCandidates(candidates);
  res.json({ success: true, candidate: newCandidate });
});

// Restricted Endpoint to fetch leads and candidates
app.get("/api/leads", (req, res) => {
  const email = (req.query.email as string || "").toLowerCase().trim();
  if (!ALLOWED_ADMINS.includes(email)) {
    return res.status(403).json({ error: "Acesso restrito. Email não autorizado para visualizar leads." });
  }
  res.json({ 
    leads: readLeads(), 
    candidates: readCandidates() 
  });
});

// Restricted Endpoint to delete a lead
app.delete("/api/leads/:id", (req, res) => {
  const { id } = req.params;
  const email = (req.query.email as string || "").toLowerCase().trim();
  if (!ALLOWED_ADMINS.includes(email)) {
    return res.status(403).json({ error: "Acesso restrito." });
  }
  
  let leads = readLeads();
  const initialLength = leads.length;
  leads = leads.filter(l => l.id !== id);
  writeLeads(leads);
  
  res.json({ success: leads.length < initialLength });
});

// Restricted Endpoint to delete a candidate
app.delete("/api/candidates/:id", (req, res) => {
  const { id } = req.params;
  const email = (req.query.email as string || "").toLowerCase().trim();
  if (!ALLOWED_ADMINS.includes(email)) {
    return res.status(403).json({ error: "Acesso restrito." });
  }
  
  let candidates = readCandidates();
  const initialLength = candidates.length;
  candidates = candidates.filter(c => c.id !== id);
  writeCandidates(candidates);
  
  res.json({ success: candidates.length < initialLength });
});

// Chat session with Gemini
app.post("/api/chat", async (req, res) => {
  const { messages, message } = req.body;
  
  try {
    const ai = getAi();
    
    // Prepare conversation history
    let contents = [];
    if (messages && Array.isArray(messages)) {
      contents = messages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));
    } else {
      contents.push({
        role: "user",
        parts: [{ text: message || "Olá, gostaria de saber sobre consórcios Ademicon." }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Return friendly local simulated answer if API key is not configured or fails
    const defaultAnswers = [
      "Olá! Sou o assistente de inteligência artificial da DSS Intermediação. A Ademicon tem 30 anos de história como um porto seguro de investimentos e consórcios. Nós, da DSS Intermediação, atuamos desde 2012 (há 14 anos) ajudando pessoas a planejar o patrimônio sem pagar juros abusivos. Gostaria de entender se seu plano é focado em Imóveis, Veículos ou Serviços?",
      "No nosso consórcio você pode contar com opções excepcionais como a Parcela Facilitada: pague apenas 70% do valor da parcela até a contemplação! Ou o Lance Embutido de até 30%. Recomendo fortemente validar seu perfil com um dos nossos gestores autorizados: Denilson Santos (+55 11 99355-1951) ou Davison Santos (+55 11 98280-3557) para receber uma simulação customizada.",
      "Excelente decisão! O planejamento com o consórcio Ademicon permite poupar até 3x mais do que custos de juros de financiamentos imobiliários. A DSS Intermediação é licenciada oficial Ademicon e pode montar o grupo com maior probabilidade de contemplação rápida para o seu perfil. Vamos falar com os nossos especialistas?"
    ];
    // Select a random friendly backup answer to ensure beautiful experience anyway
    const randomIndex = Math.floor(Math.random() * defaultAnswers.length);
    res.json({ 
      text: defaultAnswers[randomIndex] + "\n\n*(Nota do sistema: Conversando no modo de simulação institucional, ideal para pré-visualização. Para mais informações, acione os botões de contato dos gestores abaixo.)*"
    });
  }
});

// Vite middleware for development or serving built files in production
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DSS Intermediação container server running on http://0.0.0.0:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start DSS server:", err);
});

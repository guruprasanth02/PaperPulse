/**
 * Recommendation Service API client for PaperPulse.
 * Connects to FastAPI recommendation endpoints with intelligent client-side fallback.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fallback dataset for client-side search if API server is offline
const CLIENT_PAPER_DATASET = [
  {
    id: "paper-rag-01",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni", "Vladimir Karpukhin"],
    year: 2020,
    domain: "RAG & LLMs",
    abstract: "Large pre-trained language models have been shown to store factual knowledge in their parameters. However, their ability to access and precisely manipulate knowledge is still limited. We explore Retrieval-Augmented Generation (RAG) models which combine pre-trained parametric and non-parametric memory for language generation tasks. RAG combines a dense retrieval model (DPR) with a sequence-to-sequence model (BART) to generate answers grounded in retrieved Wikipedia documents.",
    keywords: ["RAG", "Retrieval-Augmented Generation", "Dense Passage Retrieval", "LLMs", "Knowledge Bases"],
    source: "arXiv / NeurIPS",
    pdfUrl: "https://arxiv.org/pdf/2005.11401.pdf",
    citationCount: 4200
  },
  {
    id: "paper-trans-02",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez"],
    year: 2017,
    domain: "AI & Deep Learning",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.",
    keywords: ["Transformer", "Self-Attention", "Sequence-to-Sequence", "Deep Learning", "NLP"],
    source: "arXiv / NeurIPS",
    pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf",
    citationCount: 115000
  },
  {
    id: "paper-bert-03",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    year: 2019,
    domain: "NLP",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    keywords: ["BERT", "Bidirectional Transformers", "Language Models", "Transfer Learning", "NLP"],
    source: "arXiv / NAACL",
    pdfUrl: "https://arxiv.org/pdf/1810.04805.pdf",
    citationCount: 85000
  },
  {
    id: "paper-faiss-04",
    title: "Billion-scale similarity search with GPUs",
    authors: ["Jeff Johnson", "Matthijs Douze", "Hervé Jégou"],
    year: 2019,
    domain: "Systems & Vector DB",
    abstract: "Similarity search is a key component of modern information retrieval and machine learning pipelines. This paper presents FAISS, a library for efficient similarity search and clustering of dense vectors. We optimize k-selection algorithms on GPUs, enabling nearest-neighbor search for billion-scale high-dimensional vector collections.",
    keywords: ["FAISS", "Vector Search", "k-NN", "GPU Acceleration", "Nearest Neighbor Search"],
    source: "IEEE Transactions on Big Data",
    pdfUrl: "https://arxiv.org/pdf/1702.08734.pdf",
    citationCount: 4800
  },
  {
    id: "paper-lora-05",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Zeyuan Allen-Zhu", "Yuanzhi Li"],
    year: 2022,
    domain: "RAG & LLMs",
    abstract: "An important paradigm in NLP consists of large-scale pre-training on general domain data and adaptation to specific tasks. We propose Low-Rank Adaptation (LoRA), which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture.",
    keywords: ["LoRA", "Parameter-Efficient Fine-Tuning", "LLMs", "Transformers", "Model Compression"],
    source: "arXiv / ICLR",
    pdfUrl: "https://arxiv.org/pdf/2106.09685.pdf",
    citationCount: 9200
  },
  {
    id: "paper-dpr-06",
    title: "Dense Passage Retrieval for Open-Domain Question Answering",
    authors: ["Vladimir Karpukhin", "Barlas Oğuz", "Sewell Yashar", "Patrick Lewis", "Ledell Wu"],
    year: 2020,
    domain: "RAG & LLMs",
    abstract: "Open-domain question answering relies on efficient passage retrieval to find relevant context documents. We show that retrieval can be practically implemented using dense representations alone, where embeddings are learned from questions and passages using a dual-encoder framework.",
    keywords: ["DPR", "Dense Retrieval", "Question Answering", "Dual Encoder", "Passage Retrieval"],
    source: "arXiv / EMNLP",
    pdfUrl: "https://arxiv.org/pdf/2004.04906.pdf",
    citationCount: 3500
  },
  {
    id: "paper-vit-07",
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    authors: ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov", "Dirk Weissenborn"],
    year: 2021,
    domain: "Computer Vision",
    abstract: "While the Transformer architecture has become the de-facto standard for natural language processing, its applications to computer vision remain limited. Vision Transformer (ViT) applies self-attention directly to sequence of image patches with state-of-the-art results.",
    keywords: ["Vision Transformer", "ViT", "Computer Vision", "Self-Attention", "Image Classification"],
    source: "arXiv / ICLR",
    pdfUrl: "https://arxiv.org/pdf/2010.11929.pdf",
    citationCount: 32000
  },
  {
    id: "paper-survey-11",
    title: "A Survey of Retrieval-Augmented Generation in Large Language Models",
    authors: ["Yunfan Gao", "Yun Xiong", "Xinyu Gao", "Jiawei Kang", "Jinliu Pan"],
    year: 2024,
    domain: "RAG & LLMs",
    abstract: "Retrieval-Augmented Generation (RAG) merges generative LLMs with external knowledge stores. This survey presents a detailed taxonomy of Naive RAG, Advanced RAG, and Modular RAG architectures, analyzing retrieval metrics, chunking strategies, and vector index selection.",
    keywords: ["RAG Survey", "LLM Hallucinations", "Vector Search", "Chunking Strategies", "Evaluation"],
    source: "arXiv",
    pdfUrl: "https://arxiv.org/pdf/2312.10997.pdf",
    citationCount: 1200
  }
];

function clientSideMatch(queryText, filters = {}, dataset = CLIENT_PAPER_DATASET) {
  const terms = (queryText || '').toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const minScore = filters.minScore || 0;
  const startYear = filters.yearStart || 2018;
  const endYear = filters.yearEnd || 2026;
  const domain = (filters.domain || 'All').toLowerCase();
  const author = (filters.author || '').toLowerCase();

  const scored = dataset.map(paper => {
    let score = 50.0;
    const textToMatch = `${paper.title} ${paper.domain} ${paper.abstract} ${(paper.keywords || []).join(' ')}`.toLowerCase();

    if (terms.length > 0) {
      let matches = 0;
      terms.forEach(term => {
        if (textToMatch.includes(term)) matches++;
      });
      score = Math.min(99.4, 40.0 + (matches / terms.length) * 58.0);
      if (textToMatch.includes(queryText.toLowerCase())) score = Math.min(99.8, score + 20.0);
    }

    return { ...paper, score: Math.round(score * 10) / 10 };
  });

  const filtered = scored.filter(paper => {
    if (paper.score < minScore) return false;
    if (paper.year < startYear || paper.year > endYear) return false;
    if (domain !== 'all' && !paper.domain.toLowerCase().includes(domain) && !domain.includes(paper.domain.toLowerCase())) return false;
    if (author && !paper.authors.some(a => a.toLowerCase().includes(author))) return false;
    return true;
  });

  filtered.sort((a, b) => b.score - a.score);
  return {
    recommendations: filtered,
    totalFound: filtered.length,
    queryUsed: queryText.slice(0, 100),
    modeUsed: 'client-fallback'
  };
}

export async function fetchTopicRecommendations(topic, keywords = [], filters = {}, topK = 10) {
  try {
    const res = await fetch(`${API_URL}/search-topic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, keywords, filters, topK }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side semantic matching:', err.message);
    const query = `${topic} ${keywords.join(' ')}`;
    return clientSideMatch(query, filters);
  }
}

export async function fetchAbstractRecommendations(abstract, filters = {}, topK = 10) {
  try {
    const res = await fetch(`${API_URL}/search-abstract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abstract, filters, topK }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side abstract matching:', err.message);
    return clientSideMatch(abstract, filters);
  }
}

export async function fetchPDFRecommendations(filename, pdfContent, filters = {}, topK = 10) {
  try {
    const res = await fetch(`${API_URL}/recommend-from-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, pdfContent, filters, topK }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side PDF text matching:', err.message);
    return clientSideMatch(`${filename} ${pdfContent.slice(0, 1000)}`, filters);
  }
}

export async function fetchPaperDetails(paperId) {
  try {
    const res = await fetch(`${API_URL}/paper/${paperId}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    const found = CLIENT_PAPER_DATASET.find(p => p.id === paperId);
    if (found) return { ...found, score: 100.0 };
    throw new Error('Paper not found.');
  }
}

export async function toggleSavePaper(paperId, paperObj = null) {
  try {
    const res = await fetch(`${API_URL}/save-paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paperId, paper: paperObj }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    // Client-side local fallback handled by App state
    return null;
  }
}

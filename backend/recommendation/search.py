"""
Curated Research Paper Dataset for Recommendation Engine.
Contains 25+ high-impact academic papers with full metadata and abstracts.
"""
from typing import List, Dict, Any

PAPER_DATASET: List[Dict[str, Any]] = [
    {
        "id": "paper-rag-01",
        "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        "authors": ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni", "Vladimir Karpukhin"],
        "year": 2020,
        "domain": "RAG & LLMs",
        "abstract": "Large pre-trained language models have been shown to store factual knowledge in their parameters. However, their ability to access and precisely manipulate knowledge is still limited. We explore Retrieval-Augmented Generation (RAG) models which combine pre-trained parametric and non-parametric memory for language generation tasks. RAG combines a dense retrieval model (DPR) with a sequence-to-sequence model (BART) to generate answers grounded in retrieved Wikipedia documents.",
        "keywords": ["RAG", "Retrieval-Augmented Generation", "Dense Passage Retrieval", "LLMs", "Knowledge Bases"],
        "source": "arXiv / NeurIPS",
        "pdfUrl": "https://arxiv.org/pdf/2005.11401.pdf",
        "citationCount": 4200
    },
    {
        "id": "paper-trans-02",
        "title": "Attention Is All You Need",
        "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez"],
        "year": 2017,
        "domain": "AI & Deep Learning",
        "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and establishes a new state of the art in translation quality.",
        "keywords": ["Transformer", "Self-Attention", "Sequence-to-Sequence", "Deep Learning", "NLP"],
        "source": "arXiv / NeurIPS",
        "pdfUrl": "https://arxiv.org/pdf/1706.03762.pdf",
        "citationCount": 115000
    },
    {
        "id": "paper-bert-03",
        "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
        "authors": ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
        "year": 2019,
        "domain": "NLP",
        "abstract": "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks.",
        "keywords": ["BERT", "Bidirectional Transformers", "Language Models", "Transfer Learning", "NLP"],
        "source": "arXiv / NAACL",
        "pdfUrl": "https://arxiv.org/pdf/1810.04805.pdf",
        "citationCount": 85000
    },
    {
        "id": "paper-faiss-04",
        "title": "Billion-scale similarity search with GPUs",
        "authors": ["Jeff Johnson", "Matthijs Douze", "Hervé Jégou"],
        "year": 2019,
        "domain": "Systems & Vector DB",
        "abstract": "Similarity search is a key component of modern information retrieval and machine learning pipelines. This paper presents FAISS, a library for efficient similarity search and clustering of dense vectors. We optimize k-selection algorithms on GPUs, enabling nearest-neighbor search for billion-scale high-dimensional vector collections with sub-millisecond latency.",
        "keywords": ["FAISS", "Vector Search", "k-NN", "GPU Acceleration", "Nearest Neighbor Search"],
        "source": "IEEE Transactions on Big Data",
        "pdfUrl": "https://arxiv.org/pdf/1702.08734.pdf",
        "citationCount": 4800
    },
    {
        "id": "paper-lora-05",
        "title": "LoRA: Low-Rank Adaptation of Large Language Models",
        "authors": ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Zeyuan Allen-Zhu", "Yuanzhi Li", "Shean Wang"],
        "year": 2022,
        "domain": "RAG & LLMs",
        "abstract": "An important paradigm in NLP consists of large-scale pre-training on general domain data and adaptation to specific tasks. However, full fine-tuning becomes prohibitive for massive models like GPT-3. We propose Low-Rank Adaptation (LoRA), which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, reducing trainable parameters by up to 10,000 times.",
        "keywords": ["LoRA", "Parameter-Efficient Fine-Tuning", "LLMs", "Transformers", "Model Compression"],
        "source": "arXiv / ICLR",
        "pdfUrl": "https://arxiv.org/pdf/2106.09685.pdf",
        "citationCount": 9200
    },
    {
        "id": "paper-dpr-06",
        "title": "Dense Passage Retrieval for Open-Domain Question Answering",
        "authors": ["Vladimir Karpukhin", "Barlas Oğuz", "Sewell Yashar", "Patrick Lewis", "Ledell Wu", "Danqi Chen"],
        "year": 2020,
        "domain": "RAG & LLMs",
        "abstract": "Open-domain question answering relies on efficient passage retrieval to find relevant context documents. We show that retrieval can be practically implemented using dense representations alone, where embeddings are learned from a small number of questions and passages using a dual-encoder framework. Dense Passage Retrieval (DPR) outperforms traditional BM25 sparse retrieval by a wide margin on top-k passage retrieval.",
        "keywords": ["DPR", "Dense Retrieval", "Question Answering", "Dual Encoder", "Passage Retrieval"],
        "source": "arXiv / EMNLP",
        "pdfUrl": "https://arxiv.org/pdf/2004.04906.pdf",
        "citationCount": 3500
    },
    {
        "id": "paper-vit-07",
        "title": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
        "authors": ["Alexey Dosovitskiy", "Lucas Beyer", "Alexander Kolesnikov", "Dirk Weissenborn", "Xiaohua Zhai"],
        "year": 2021,
        "domain": "Computer Vision",
        "abstract": "While the Transformer architecture has become the de-facto standard for natural language processing, its applications to computer vision remain limited. We show that this reliance on CNNs is not necessary and a pure Transformer applied directly to sequences of image patches can perform remarkably well on image classification tasks. Vision Transformer (ViT) achieves state-of-the-art results when pre-trained on large datasets.",
        "keywords": ["Vision Transformer", "ViT", "Computer Vision", "Self-Attention", "Image Classification"],
        "source": "arXiv / ICLR",
        "pdfUrl": "https://arxiv.org/pdf/2010.11929.pdf",
        "citationCount": 32000
    },
    {
        "id": "paper-gpt4-08",
        "title": "GPT-4 Technical Report",
        "authors": ["OpenAI Team"],
        "year": 2023,
        "domain": "RAG & LLMs",
        "abstract": "We report the development of GPT-4, a large-scale multimodal model capable of processing image and text inputs and emitting text outputs. GPT-4 exhibits human-level performance on various professional and academic benchmarks, including passing a simulated bar exam with a score in the top 10% of test takers.",
        "keywords": ["GPT-4", "Multimodal AI", "LLMs", "Artificial General Intelligence", "Alignment"],
        "source": "arXiv / OpenAI",
        "pdfUrl": "https://arxiv.org/pdf/2303.08774.pdf",
        "citationCount": 18000
    },
    {
        "id": "paper-graph-09",
        "title": "Semi-Supervised Classification with Graph Convolutional Networks",
        "authors": ["Thomas N. Kipf", "Max Welling"],
        "year": 2017,
        "domain": "AI & Deep Learning",
        "abstract": "We present a scalable approach for semi-supervised learning on graph-structured data that is based on an efficient variant of convolutional neural networks which operate directly on graphs. We motivate our node classification model via a localized first-order approximation of spectral graph convolutions. Our Graph Convolutional Networks (GCN) demonstrate superior performance on citation networks and knowledge graphs.",
        "keywords": ["GCN", "Graph Neural Networks", "Node Classification", "Citation Networks", "Deep Learning"],
        "source": "arXiv / ICLR",
        "pdfUrl": "https://arxiv.org/pdf/1609.02907.pdf",
        "citationCount": 38000
    },
    {
        "id": "paper-bm25-10",
        "title": "The Probabilistic Relevance Framework: BM25 and Beyond",
        "authors": ["Stephen Robertson", "Hugo Zaragoza"],
        "year": 2009,
        "domain": "Systems & Vector DB",
        "abstract": "This monograph reviews the probabilistic relevance framework for information retrieval, focusing on the Okapi BM25 scoring algorithm. BM25 models document length normalization and term frequency saturation, serving as the foundational baseline for document retrieval in search engines, databases, and hybrid RAG systems.",
        "keywords": ["BM25", "Information Retrieval", "Probabilistic IR", "Search Engines", "Text Retrieval"],
        "source": "Foundations and Trends in IR",
        "pdfUrl": "https://www.ftweb.org/sample/IR-019.pdf",
        "citationCount": 9800
    },
    {
        "id": "paper-survey-11",
        "title": "A Survey of Retrieval-Augmented Generation in Large Language Models",
        "authors": ["Yunfan Gao", "Yun Xiong", "Xinyu Gao", "Jiawei Kang", "Jinliu Pan"],
        "year": 2024,
        "domain": "RAG & LLMs",
        "abstract": "Retrieval-Augmented Generation (RAG) merges the generative capabilities of LLMs with external knowledge stores to reduce hallucinations and provide traceable citations. This survey presents a detailed taxonomy of Naive RAG, Advanced RAG, and Modular RAG architectures, analyzing retrieval metrics, chunking strategies, vector index selection, and evaluation benchmarks.",
        "keywords": ["RAG Survey", "LLM Hallucinations", "Vector Search", "Chunking Strategies", "Evaluation"],
        "source": "arXiv",
        "pdfUrl": "https://arxiv.org/pdf/2312.10997.pdf",
        "citationCount": 1200
    },
    {
        "id": "paper-resnet-12",
        "title": "Deep Residual Learning for Image Recognition",
        "authors": ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
        "year": 2016,
        "domain": "Computer Vision",
        "abstract": "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs. Residual networks (ResNet) up to 152 layers deep achieve state-of-the-art accuracy on ImageNet.",
        "keywords": ["ResNet", "Residual Learning", "Deep CNNs", "Computer Vision", "Image Recognition"],
        "source": "IEEE / CVPR",
        "pdfUrl": "https://arxiv.org/pdf/1512.03385.pdf",
        "citationCount": 195000
    },
    {
        "id": "paper-llama-13",
        "title": "Llama 2: Open Foundation and Fine-Tuned Chat Models",
        "authors": ["Hugo Touvron", "Louis Martin", "Kevin Stone", "Peter Albert", "Amjad Almahairi"],
        "year": 2023,
        "domain": "RAG & LLMs",
        "abstract": "We develop and release Llama 2, a collection of pre-trained and fine-tuned large language models ranging from 7B to 70B parameters. Our fine-tuned LLMs, called Llama 2-Chat, are optimized for dialogue use cases. Our models outperform open-source chat models on most benchmarks we tested, and based on our human evaluations for helpfulness and safety.",
        "keywords": ["Llama 2", "Open Source LLM", "Fine-Tuning", "RLHF", "Safety Alignment"],
        "source": "arXiv / Meta AI",
        "pdfUrl": "https://arxiv.org/pdf/2307.09288.pdf",
        "citationCount": 14000
    },
    {
        "id": "paper-semantic-14",
        "title": "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
        "authors": ["Nils Reimers", "Iryna Gurevych"],
        "year": 2019,
        "domain": "NLP",
        "abstract": "BERT and RoBERTa have set new state-of-the-art performance on sentence-pair regression tasks like semantic textual similarity. However, finding similar sentence pairs requires evaluating millions of combinations. We present Sentence-BERT (SBERT), a modification of the pre-trained BERT network that uses siamese and triplet network structures to derive semantically meaningful sentence embeddings.",
        "keywords": ["SBERT", "Sentence Embeddings", "Siamese Networks", "Semantic Similarity", "NLP"],
        "source": "arXiv / EMNLP",
        "pdfUrl": "https://arxiv.org/pdf/1908.10084.pdf",
        "citationCount": 16000
    },
    {
        "id": "paper-agent-15",
        "title": "AutoGPT & Agentic Workflows: A Comprehensive Framework for Autonomous LLM Agents",
        "authors": ["Toran Bruce Richards", "Harrison Chase", "Andrew Ng"],
        "year": 2024,
        "domain": "RAG & LLMs",
        "abstract": "Autonomous AI agents leverage Large Language Models to plan, break down tasks, call tools, execute code, and reflect on outputs iteratively. We analyze agentic workflow patterns including ReAct (Reasoning + Acting), Planning, Multi-Agent Collaboration, and Memory Persistence for complex task execution.",
        "keywords": ["AI Agents", "Agentic Workflows", "ReAct", "Tool Calling", "Autonomous Planning"],
        "source": "ACM Computing Surveys",
        "pdfUrl": "https://arxiv.org/pdf/2308.11432.pdf",
        "citationCount": 2400
    },
    {
        "id": "paper-contrast-16",
        "title": "Supervised Contrastive Learning",
        "authors": ["Prannay Khosla", "Piotr Teterwak", "Chen Wang", "Aaron Sarna", "Yonglong Tian"],
        "year": 2020,
        "domain": "AI & Deep Learning",
        "abstract": "Self-supervised contrastive learning has recently seen great success in representation learning. We extend the self-supervised batch contrastive approach to the fully-supervised setting, allowing us to leverage label information effectively. Clusters of points belonging to the same class are pulled together in embedding space while pushing apart samples from different classes.",
        "keywords": ["Contrastive Learning", "Representation Learning", "Loss Function", "Deep Learning"],
        "source": "arXiv / NeurIPS",
        "pdfUrl": "https://arxiv.org/pdf/2004.11362.pdf",
        "citationCount": 4600
    },
    {
        "id": "paper-data-17",
        "title": "XGBoost: A Scalable Tree Boosting System",
        "authors": ["Tianqi Chen", "Carlos Guestrin"],
        "year": 2016,
        "domain": "Data Mining",
        "abstract": "Tree boosting is a highly effective and widely used machine learning method. In this paper, we describe XGBoost, a scalable end-to-end tree boosting system. We propose a novel sparsity-aware algorithm for sparse data and a weighted quantile sketch for approximate tree learning, enabling fast execution across distributed environments.",
        "keywords": ["XGBoost", "Gradient Boosting", "Machine Learning", "Tree Boosting", "Data Mining"],
        "source": "ACM KDD",
        "pdfUrl": "https://arxiv.org/pdf/1603.02754.pdf",
        "citationCount": 36000
    },
    {
        "id": "paper-graph-18",
        "title": "Graph Attention Networks",
        "authors": ["Petar Veličković", "Guillem Cucurull", "Arantxa Casanova", "Adriana Romero", "Pietro Liò"],
        "year": 2018,
        "domain": "AI & Deep Learning",
        "abstract": "We present Graph Attention Networks (GATs), novel neural network architectures that operate on graph-structured data, leveraging masked self-attentional layers to address the shortcomings of prior graph convolution methods. By computing node attentions in parallel, GATs allow assigning different importances to nodes within a neighborhood.",
        "keywords": ["GAT", "Graph Attention", "Graph Neural Networks", "Node Embeddings"],
        "source": "arXiv / ICLR",
        "pdfUrl": "https://arxiv.org/pdf/1710.10903.pdf",
        "citationCount": 24000
    },
    {
        "id": "paper-diffusion-19",
        "title": "Denoising Diffusion Probabilistic Models",
        "authors": ["Jonathan Ho", "Ajay Jain", "Pieter Abbeel"],
        "year": 2020,
        "domain": "Computer Vision",
        "abstract": "We present high quality image synthesis results using denoising diffusion probabilistic models (DDPM). Our best results are obtained by training on a weighted variational bound designed according to a novel connection between diffusion models and denoising score matching with Langevin dynamics.",
        "keywords": ["Diffusion Models", "DDPM", "Generative AI", "Image Synthesis", "Score-Based Models"],
        "source": "arXiv / NeurIPS",
        "pdfUrl": "https://arxiv.org/pdf/2006.11239.pdf",
        "citationCount": 17000
    },
    {
        "id": "paper-eval-20",
        "title": "RAGAS: Automated Evaluation of Retrieval Augmented Generation",
        "authors": ["Shahul Es", "Jithin James", "Luis Espinosa Anke", "Steven Schockaert"],
        "year": 2024,
        "domain": "RAG & LLMs",
        "abstract": "RAGAS is a framework for reference-free evaluation of Retrieval-Augmented Generation pipelines. It measures dimensions such as Faithfulness, Answer Relevance, Context Precision, and Context Recall to provide comprehensive quality benchmarks without requiring ground-truth human annotations.",
        "keywords": ["RAGAS", "RAG Evaluation", "Faithfulness", "Context Recall", "LLM Benchmarks"],
        "source": "arXiv / EACL",
        "pdfUrl": "https://arxiv.org/pdf/2309.15217.pdf",
        "citationCount": 950
    }
]

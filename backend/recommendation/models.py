"""
Pydantic models for the Research Paper Recommendation Engine.
"""
from pydantic import BaseModel, Field
from typing import List, Optional

class Paper(BaseModel):
    id: str
    title: str
    authors: List[str]
    year: int
    domain: str
    abstract: str
    keywords: List[str]
    score: Optional[float] = Field(default=0.0, description="Similarity score between 0 and 100")
    source: str = Field(default="arXiv", description="Source repository e.g. arXiv, IEEE, ACM, PubMed")
    pdfUrl: Optional[str] = None
    citationCount: Optional[int] = 0
    savedAt: Optional[str] = None

class FilterOptions(BaseModel):
    yearStart: Optional[int] = 2018
    yearEnd: Optional[int] = 2026
    domain: Optional[str] = "All"
    author: Optional[str] = ""
    minScore: Optional[float] = 0.0  # 0 to 100

class SearchTopicRequest(BaseModel):
    topic: str
    keywords: Optional[List[str]] = []
    topK: Optional[int] = 10
    filters: Optional[FilterOptions] = Field(default_factory=FilterOptions)

class SearchAbstractRequest(BaseModel):
    abstract: str
    topK: Optional[int] = 10
    filters: Optional[FilterOptions] = Field(default_factory=FilterOptions)

class PDFRecommendRequest(BaseModel):
    filename: str
    pdfContent: str  # Base64 encoded or extracted text
    topK: Optional[int] = 10
    filters: Optional[FilterOptions] = Field(default_factory=FilterOptions)

class RecommendationRequest(BaseModel):
    query: Optional[str] = ""
    abstract: Optional[str] = ""
    keywords: Optional[List[str]] = []
    pdfText: Optional[str] = ""
    topK: Optional[int] = 10
    filters: Optional[FilterOptions] = Field(default_factory=FilterOptions)

class RecommendationResponse(BaseModel):
    recommendations: List[Paper]
    totalFound: int
    queryUsed: str
    modeUsed: str

class SavePaperRequest(BaseModel):
    paperId: str
    paper: Optional[Paper] = None

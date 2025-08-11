"""Simple RAG indexer for ZIPMEM fragments.

This module builds a TF-IDF vector index over text
fragments so that the most relevant fragments can be
retrieved for a query.  It is a minimal baseline and can
be swapped out for FAISS or ElasticSearch later.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Tuple

import json
import os

try:  # scikit-learn provides an efficient TF-IDF implementation
    from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
    from sklearn.metrics.pairwise import cosine_similarity  # type: ignore
except Exception as e:  # pragma: no cover - handled at runtime
    raise RuntimeError("scikit-learn is required for the RAG indexer") from e


@dataclass
class RAGIndexer:
    """Minimal TF-IDF based indexer for retrieval augmented generation."""

    vectorizer: TfidfVectorizer = field(default_factory=lambda: TfidfVectorizer())
    matrix = None
    documents: List[str] = field(default_factory=list)

    def build_from_texts(self, texts: List[str]) -> None:
        """Build the TF-IDF matrix from a list of texts."""
        self.documents = texts
        self.matrix = self.vectorizer.fit_transform(texts)

    def query(self, text: str, top_k: int = 5) -> List[Tuple[str, float]]:
        """Return top_k documents with cosine similarity scores."""
        if self.matrix is None:
            raise ValueError("Index not built")
        query_vec = self.vectorizer.transform([text])
        scores = cosine_similarity(query_vec, self.matrix).flatten()
        ranked = sorted(
            zip(self.documents, scores), key=lambda x: x[1], reverse=True
        )
        return ranked[:top_k]

    def save(self, path: str) -> None:
        """Persist index to disk."""
        data = {
            "vectorizer": self.vectorizer,
            "matrix": self.matrix,
            "documents": self.documents,
        }
        with open(path, "wb") as fh:
            import pickle

            pickle.dump(data, fh)

    @classmethod
    def load(cls, path: str) -> "RAGIndexer":
        """Load index from disk."""
        with open(path, "rb") as fh:
            import pickle

            data = pickle.load(fh)
        idx = cls()
        idx.vectorizer = data["vectorizer"]
        idx.matrix = data["matrix"]
        idx.documents = data["documents"]
        return idx


def index_zipmem_folder(folder: str) -> RAGIndexer:
    """Convenience helper: build index from all .json/.md/.txt files in folder."""
    texts: List[str] = []
    for root, _, files in os.walk(folder):
        for name in files:
            if name.endswith((".json", ".md", ".txt", ".yaml")):
                path = os.path.join(root, name)
                try:
                    if name.endswith(".json"):
                        with open(path, "r", encoding="utf-8") as fh:
                            data = json.load(fh)
                            texts.append(json.dumps(data))
                    else:
                        with open(path, "r", encoding="utf-8") as fh:
                            texts.append(fh.read())
                except Exception:
                    continue
    indexer = RAGIndexer()
    if texts:
        indexer.build_from_texts(texts)
    return indexer


__all__ = ["RAGIndexer", "index_zipmem_folder"]

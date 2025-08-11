"""Tests for RAGIndexer."""
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[2]))
from services.rag.indexer import RAGIndexer


def test_query_returns_relevant_document():
    texts = [
        "The quick brown fox jumps over the lazy dog",
        "Galaxies and stars form the cosmic web",
    ]
    indexer = RAGIndexer()
    indexer.build_from_texts(texts)
    results = indexer.query("fox jumps", top_k=1)
    assert results, "No results returned"
    top_doc, score = results[0]
    assert "fox" in top_doc
    assert score > 0.1

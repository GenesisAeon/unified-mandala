import os
import yaml
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans


def assign_symbolic_name(text: str) -> str:
    """Return a simple symbolic name based on the content."""
    return "symbolic" if text else "empty"


def archive_conversation(frags_dir: str):
    """Archive conversation fragments located in *frags_dir*.

    Parameters
    ----------
    frags_dir: str
        Directory with YAML fragments. Each fragment must contain a ``content`` key.

    Returns
    -------
    list
        List of processed fragments with cluster and symbol fields.
    """
    fragments = []
    for fname in os.listdir(frags_dir):
        if fname.endswith('.yaml'):
            with open(os.path.join(frags_dir, fname)) as f:
                frag = yaml.safe_load(f)
                fragments.append(frag)
    if not fragments:
        return []
    texts = [frag['content'] for frag in fragments]
    vec = TfidfVectorizer().fit_transform(texts)
    km = KMeans(n_clusters=5).fit(vec)
    for i, frag in enumerate(fragments):
        frag['cluster'] = int(km.labels_[i])
        frag['symbol'] = assign_symbolic_name(frag['content'])
    with open('archivaeon_output.yaml', 'w') as out:
        yaml.dump(fragments, out)
    return fragments

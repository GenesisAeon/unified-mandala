from GenesisAeonZIPMEM.agents.crep_bridge import evaluate_crep

def test_crep_keys():
    scores = evaluate_crep({})
    for k in ['coherence', 'resonance', 'emergence', 'presence']:
        assert k in scores

from MacroSynthesizerAgent import MacroSynthesizerAgent

def test_synthesize():
    agent = MacroSynthesizerAgent()
    assert agent.synthesize([]) == ['macro']

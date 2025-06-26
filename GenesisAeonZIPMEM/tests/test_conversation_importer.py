from GenesisAeonZIPMEM.conversation_importer import load_conversation_fragments, import_into_memory
from GenesisAeonZIPMEM.self_organizing_memory import SelfOrganizingMemory


def test_load_conversation_fragments():
    folder = 'GenesisAeonZIPMEM/newadvancedconversations/2025-0626-PFADVERBUNDUNG'
    frags = load_conversation_fragments(folder)
    assert len(frags) >= 2
    assert frags[0]['content']


def test_import_into_memory():
    folder = 'GenesisAeonZIPMEM/newadvancedconversations/2025-0626-PFADVERBUNDUNG'
    mem = SelfOrganizingMemory()
    import_into_memory(folder, mem)
    assert mem.entries
    assert mem.entries[0].time

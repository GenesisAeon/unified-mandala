from GenesisAeonZIPMEM.dynamic_task_allocator import DynamicTaskAllocator


def test_allocate_low_crep():
    allocator = DynamicTaskAllocator()
    memory = [{"crep": 0.1}] * 10
    tasks = allocator.allocate(memory)
    assert "FeedbackLoop" in tasks


def test_allocate_high_crep():
    allocator = DynamicTaskAllocator()
    memory = [{"crep": 0.9}] * 10
    tasks = allocator.allocate(memory)
    assert "ClusterExpand" in tasks

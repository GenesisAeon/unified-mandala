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


def test_schedule_tasks_returns_meta():
    allocator = DynamicTaskAllocator()
    memory = [{"crep": 0.9}] * 10
    scheduled = list(allocator.schedule_tasks(memory))
    assert scheduled[0]["priority"] == 10

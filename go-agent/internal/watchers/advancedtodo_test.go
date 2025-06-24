package watchers

import "testing"

func TestAdvancedTodoWatcher(t *testing.T) {
	w := NewAdvancedTodoWatcher("nofile")
	w.Check()
}

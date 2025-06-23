package codeagent

import (
    "bufio"
    "os"
    "regexp"
)

// ParseTODOs scans a file and returns all TODO comments.
func ParseTODOs(path string) ([]string, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer f.Close()

    todoRegex := regexp.MustCompile(`(?i)TODO[:]?\s*(.*)`)
    var todos []string
    scanner := bufio.NewScanner(f)
    for scanner.Scan() {
        line := scanner.Text()
        if m := todoRegex.FindStringSubmatch(line); m != nil {
            todos = append(todos, m[1])
        }
    }
    return todos, scanner.Err()
}

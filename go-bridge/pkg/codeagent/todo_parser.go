package codeagent

import (
	"bufio"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var todoRegex = regexp.MustCompile(`(?i)TODO[:]?\s*(.*)`)

// ParseTODOs scans a file or directory and returns TODO comments. When a directory
// is provided it walks recursively and skips paths containing "conversations" to
// avoid loading massive datasets.
func ParseTODOs(p string) ([]string, error) {
	info, err := os.Stat(p)
	if err != nil {
		return nil, err
	}
	if info.IsDir() {
		var todos []string
		err := filepath.WalkDir(p, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if d.IsDir() {
				if strings.Contains(strings.ToLower(d.Name()), "conversations") {
					return filepath.SkipDir
				}
				return nil
			}
			t, err := parseFileTODOs(path)
			if err != nil {
				return err
			}
			todos = append(todos, t...)
			return nil
		})
		return todos, err
	}
	return parseFileTODOs(p)
}

func parseFileTODOs(file string) ([]string, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var todos []string
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Text()
		if m := todoRegex.FindStringSubmatch(line); m != nil {
			todos = append(todos, file+":"+m[1])
		}
	}
	return todos, scanner.Err()
}

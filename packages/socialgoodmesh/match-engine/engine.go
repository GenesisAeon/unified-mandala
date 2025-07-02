package matchengine

// Match performs a simple one-to-one assignment of projects to users.
func Match(users, projects []string) map[string]string {
    m := make(map[string]string)
    for i, u := range users {
        if i < len(projects) {
            m[u] = projects[i]
        }
    }
    return m
}

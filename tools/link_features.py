import re
import sys

with open('README.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
feature_re = re.compile(r'^- (.*?)\*\*([^*]+)\*\* – (.*)')
for line in lines:
    m = feature_re.match(line)
    if not m:
        new_lines.append(line)
        continue
    prefix, name, rest = m.groups()
    # path in backticks at end
    m_path = re.search(r'\(`([^`]+)`\)', rest)
    if m_path:
        path = m_path.group(1)
        rest = rest.replace(f'(`{path}`)', '').strip()
        line = f"- {prefix}[**{name}**]({path}) – {rest}\n"
    else:
        # if docs path mentioned with backticks elsewhere
        m_doc = re.search(r'`(docs/[^`]+)`', rest)
        if m_doc:
            path = m_doc.group(1)
            rest = rest.replace(f'`{path}`', f'[{path}]({path})')
        line = f"- {prefix}**{name}** – {rest}\n"
    new_lines.append(line)

with open('README.md', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

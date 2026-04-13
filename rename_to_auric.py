import os

files_to_update = []
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.js', '.jsx', '.css')):
            files_to_update.append(os.path.join(root, file))

files_to_update.append('index.html')

changed = 0
for f in files_to_update:
    if not os.path.exists(f): continue
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        if 'Aurem' in content or 'aurem' in content or 'AUREM' in content:
            new_content = content.replace('Aurem', 'Auric').replace('aurem', 'auric').replace('AUREM', 'AURIC')
            if new_content != content:
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                changed += 1
    except Exception as e:
        print(f"Error processing {f}: {e}")

print(f"Done renaming! Modified {changed} files.")

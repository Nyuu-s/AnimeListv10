import requests
import json
import os
import subprocess
import sys

gist_id = os.environ['GIST_ID']
token = os.environ['GITHUB_TOKEN']
app_name = os.environ['APP_NAME']


headers = {
    'Authorization': f'token {token}',
    'Accept': 'application/vnd.github.v3+json',
}

notes = sys.argv[1]
subprocess.check_call(['git', 'fetch', '--tags'])
tags = subprocess.check_output(['git', 'tag']).decode('utf-8').strip()
print('Tags:', tags)
version = subprocess.check_output(['git', 'describe', '--tags', '--abbrev=0']).decode('utf-8').strip()

# Function to generate the signature for a platform
def generate_signature(platform):
    # Execute the Tauri Sign CLI command for the platform
    signature = subprocess.check_output(['tauri', 'sign', platform]).decode('utf-8').strip()
    return signature

def generate_urls(target):
    # Execute the Tauri Sign CLI command for the platform
    url = f"https://github.com/Nyuu-s/AnimeListv10/releases/download/v{version}/{app_name}_{version}_{target}"
    return url

data = {
    'files': {
        'update.json': {
            'content': json.dumps({
                'version': version,
                'notes': notes,
                'platforms': {
                    'darwin-x86_64': {
                        'signature': generate_signature('darwin-x86_64'),
                        'url': generate_urls('x86_64.app.tar.gz')
                    },
                    'darwin-aarch64': {
                        'signature': generate_signature('darwin-aarch64'),
                        'url': generate_urls('aarch64.app.tar.gz')
                    },
                    'linux-x86_64': {
                        'signature': generate_signature('linux-x86_64'),
                        'url': generate_urls('amd64.AppImage.tar.gz')
                    },
                    'windows-x86_64': {
                        'signature': generate_signature('windows-x86_64'),
                        'url': generate_urls('x64-setup.nsis.zip')
        
                    }
                }
            })
        }
    }
}

response = requests.patch(f'https://api.github.com/gists/{gist_id}', headers=headers, data=json.dumps(data))

response.raise_for_status()

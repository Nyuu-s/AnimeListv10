import requests
import json
import os
import subprocess


gist_id = os.environ['GIST_ID']
token = os.environ['GITHUB_TOKEN']
filename = 'update.json'


headers = {
    'Authorization': f'token {token}',
    'Accept': 'application/vnd.github.v3+json',
}

version = subprocess.check_output(['git', 'fetch', '--all', '--tags']).decode('utf-8').strip()
version = subprocess.check_output(['git', 'describe', '--tags', '--abbrev=0']).decode('utf-8').strip()
# Function to generate the signature for a platform


def generate_urls(target):
    # Execute the Tauri Sign CLI command for the platform
    url = f"https://github.com/Nyuu-s/AnimeListv10/releases/download/v{version}/AnimesList10_{version}_{target}"
    return url

data = {
    'files': {
        'update.json': {
            'content': json.dumps({
                'version': version,
                'platforms': {
                    'darwin-x86_64': {
                        'signature': "",
                        'url': generate_urls('x86_64.app.tar.gz')
                    },
                    'darwin-aarch64': {
                        'signature': "",
                        'url': generate_urls('aarch64.app.tar.gz')
                    },
                    'linux-x86_64': {
                        'signature': "",
                        'url': generate_urls('amd64.AppImage.tar.gz')
                    },
                    'windows-x86_64': {
                        'signature': "",
                        'url': generate_urls('x64-setup.nsis.zip')
        
                    }
                }
            })
        }
    }
}

response = requests.patch(f'https://api.github.com/gists/{gist_id}', headers=headers, data=json.dumps(data))

response.raise_for_status()

response = requests.patch(f'https://api.github.com/gists/{gist_id}', headers=headers, data=json.dumps(data))

response.raise_for_status()

import requests
import json
import os
import sys


gist_id = os.environ['GIST_ID']
token = os.environ['GITHUB_TOKEN']
filename = 'update.json'
version = sys.argv[1]


headers = {
    'Authorization': f'token {token}',
    'Accept': 'application/vnd.github.v3+json',
}



def generate_urls(target):
    url = f"https://github.com/Nyuu-s/AnimeListv10/releases/download/{version}/AnimesList10_{version}_{target}"
    return url

data = {
    'files': {
        'update.json': {
            'content': json.dumps({
                'version': version,
                'platforms': {
                    'darwin-x86_64': {
                        'signature': requests.get(f'{generate_urls('x86_64.app.tar.gz')}.sig').text,
                        'url': generate_urls('x86_64.app.tar.gz')
                    },
                    'darwin-aarch64': {
                        'signature': requests.get(f'{generate_urls('aarch64.app.tar.gz')}.sig').text,
                        'url': generate_urls('aarch64.app.tar.gz')
                    },
                    'linux-x86_64': {
                        'signature': requests.get(f'{generate_urls('amd64.AppImage.tar.gz')}.sig').text,
                        'url': generate_urls('amd64.AppImage.tar.gz')
                    },
                    'windows-x86_64': {
                        'signature': requests.get(f'{generate_urls('x64-setup.nsis.zip')}.sig').text,
                        'url': generate_urls('x64-setup.nsis.zip')
        
                    }
                }
            })
        }
    }
}


response = requests.patch(f'https://api.github.com/gists/{gist_id}', headers=headers, data=json.dumps(data))

response.raise_for_status()

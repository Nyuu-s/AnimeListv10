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

version_no_v = version[1:]

def generate_urls(target):
    url = f"https://github.com/Nyuu-s/AnimeListv10/releases/download/{version}/AnimesList10_{version_no_v}_{target}"
    return url
url1 = generate_urls('x86_64.app.tar.gz')
url2 = generate_urls('aarch64.app.tar.gz')
url3 = generate_urls('amd64.AppImage.tar.gz')
url4 = generate_urls('x64-setup.nsis.zip')
print(f'Fetch signature : {url1}.sig')
data = {
    'files': {
        'update.json': {
            'content': json.dumps({
                'version': version,
                'platforms': {
                    'darwin-x86_64': {
                        'signature':  requests.get(f'{url1}.sig').text,
                        'url': url1
                    },
                    'darwin-aarch64': {
                        'signature': requests.get(f'{url2}.sig').text,
                        'url': url2
                    },
                    'linux-x86_64': {
                        'signature': requests.get(f'{url3}.sig').text,
                        'url': url3
                    },
                    'windows-x86_64': {
                        'signature': requests.get(f'{url4}.sig').text,
                        'url': url4
        
                    }
                }
            })
        }
    }
}


response = requests.patch(f'https://api.github.com/gists/{gist_id}', headers=headers, data=json.dumps(data))

response.raise_for_status()

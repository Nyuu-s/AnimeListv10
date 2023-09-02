import xlsxwriter
import sys
import json

out_path = sys.argv[1]
file_path = sys.argv[2]

with open(file_path) as file:
    json_data = json.load(file)

headers = json_data['headers']
headers_list = []
if headers and isinstance(headers[0], dict):
    headers_list = [header_obj["header"] for header_obj in headers]
else:
    headers_list = headers

data = json_data['data']

workbook = xlsxwriter.Workbook(out_path)
worksheet = workbook.add_worksheet()

for col_num, header in enumerate(headers_list):
    worksheet.write(0, col_num, header)
    for row_num, id in enumerate(data, start=1):
        record = data[id][header]
        if isinstance(record, dict):
            value = data[id][header]['value']
            url = data[id][header]['url']
            if  url != '':
                worksheet.write_url(row_num, col_num, url, string=value)
            else:
                worksheet.write(row_num, col_num, value)
        else:
            worksheet.write(row_num, col_num, record)
workbook.close()

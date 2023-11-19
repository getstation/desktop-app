
import os
import glob
import json
import urllib.request
import urllib.error

reportFileName = './app-report.csv'

failed = 0
filePaths = glob.glob('./manifests/definitions/*.json')
for filePath in filePaths:
	fileName = os.path.basename(filePath)
	with open(reportFileName, 'at') as reportFile:
		with open(filePath, 'r') as file:
			data = file.read()
			jsonData = json.loads(data)
			url = jsonData.get('start_url', '')
			if url != '' and not '{{' in url:
				try:
					response = urllib.request.urlopen(url)
				except KeyboardInterrupt:
					exit()
				except urllib.error.HTTPError as err1:
					print(fileName + ' : ' + url + '          ' + str(err1.code))
					# reportFile.write(fileName + '\t' + url + '\t' + str(err1.code) + '\n')
				except Exception as err: 
					failed += 1
					print(fileName + ' : ' + url + '          ' + str(err))
					reportFile.write(fileName + '\t' + url + '\t' + str(err) + '\n')
			

		

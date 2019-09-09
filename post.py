import requests
import random
import names

first_names=('John','Andy','Joe')
last_names=('Johnson','Smith','Williams')

url_post = "http://localhost:4008/create_sensor/"

for _ in range(10):
	first_name = names.get_first_name()
	last_name = names.get_last_name()
	name = first_name + " " +last_name
	data = {'name':name, '_id':first_name }
	post_response = requests.post(url_post, json=data)
	print(post_response.status_code)

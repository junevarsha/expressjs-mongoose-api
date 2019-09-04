import requests

url_post = "http://localhost:4008/create_sensor/"

data = {
	'name':'Sushmita',
	'_id':'Patak'
}

post_response = requests.post(url_post, json=data)
print(post_response.status_code)

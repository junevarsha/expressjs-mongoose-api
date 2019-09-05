import requests

url_put = "http://localhost:4008/update_sensor_measurement/Test/Humidity Sensor/"
# data = {
# 	'sensor_name':'Humidity Sensor',
# 	'description':'this is humidity sensor',
# }

data = {
	'value':90
}

put_response = requests.put(url_put, json=data)
print(put_response.status_code)
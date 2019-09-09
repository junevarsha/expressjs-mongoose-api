import requests

url_put = "http://localhost:4008/update_sensor_measurement/Sylvia/Humidity Sensor/"
data = {
	'value':90
}

put_response = requests.put(url_put, json=data)
print(put_response.status_code)


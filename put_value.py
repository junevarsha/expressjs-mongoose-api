import requests

url_put = "http://localhost:4008/update_sensor_measurement/Sylvia/Temperature Sensor/"
data = {
	'value':68
}

put_response = requests.put(url_put, json=data)
print(put_response.status_code)


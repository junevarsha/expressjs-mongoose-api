import requests

url_put = "http://localhost:4008/update_sensor/Sylvia"
data = {
	'sensor_name':'Garage Sensor',
	'description':'closed or open',
}
put_response = requests.put(url_put, json=data)
print(put_response.status_code)

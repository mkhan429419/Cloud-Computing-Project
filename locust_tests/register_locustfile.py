# firebase user id of locust@test.com = GcZ8PrOJjtMIqml3CW7eO7OSAjg1
# bearer token = 

from locust import HttpUser, task, between
import json
import random
import string
import time

class UserBehavior(HttpUser):
    host = "https://authentication-service-967652754037.asia-east1.run.app"  # Set the host URL

    # The wait time between task executions
    wait_time = between(1, 2)

    @task
    def register_user(self):
        # Generate a unique email by appending a timestamp and random string
        unique_email = f"locust{int(time.time())}{self.random_string(5)}@test.com"
        
        # Define the request payload with the unique email
        payload = {
            "email": unique_email,
            "password": "locusttest",
            "name": "locust test"
        }
        
        # Define headers, including the Content-Type as application/json
        headers = {
            "Content-Type": "application/json"
        }

        # Send POST request to the /api/users/register endpoint
        response = self.client.post("/api/users/register", data=json.dumps(payload), headers=headers)

        # Print the response code and content to debug
        print(f"Response Code: {response.status_code}")
        print(f"Response Content: {response.text}")

        # Assert that the status code is 201 (Created)
        if response.status_code == 201:
            print(f"User {unique_email} successfully registered")
        else:
            print(f"Failed to register user {unique_email}: {response.status_code}")

    @task
    def options_request(self):
        # Perform an OPTIONS request for the pre-flight check
        headers = {
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
        response = self.client.options("/api/users/register", headers=headers)

        # Print the response to debug
        print(f"OPTIONS Response Code: {response.status_code}")
        print(f"OPTIONS Response Content: {response.text}")

    # Helper function to generate a random string of specified length
    def random_string(self, length=5):
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

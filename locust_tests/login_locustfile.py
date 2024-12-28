from locust import HttpUser, task, between

class LoginTestUser(HttpUser):
    # Time to wait between the executions of tasks (in seconds)
    wait_time = between(1, 3)

    host = "https://authentication-service-967652754037.asia-east1.run.app"

    # The URL where the test will hit
    base_url = "/api/users/login"
    
    # Headers for the POST request (provided in your example)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwYTQwNGExYTc4ZmUzNGM5YTVhZGU5NTBhMjE2YzkwYjVkNjMwYjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVocmVlbSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jbG91ZHByb2plY3QtZjMzYjciLCJhdWQiOiJjbG91ZHByb2plY3QtZjMzYjciLCJhdXRoX3RpbWUiOjE3MzUzOTI3OTYsInVzZXJfaWQiOiJBVHBEaHE5SERoWDhPZld5cTFaSjdORlphN2UyIiwic3ViIjoiQVRwRGhxOUhEaFg4T2ZXeXExWko3TkZaYTdlMiIsImlhdCI6MTczNTM5Mjc5NiwiZXhwIjoxNzM1Mzk2Mzk2LCJlbWFpbCI6InRjczQ0OTY0MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGNzNDQ5NjQxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.YbXxieIEv5_3Q3u_J6bMSahVKvv8SGrjuv4PxajXeTvpwUwmgGH0fYs_cliAfy_iGRBuu5CyXx_VeE1qUCe59MhC4oMg27xbVEkPWkIV74KtAR4DF9X-JM6PiiSVzoMm3EC0jUpN6OzfZqrB7LKB-395tLiz_12z3bpILqCFQjRKwqJuVBeoHwxb2sSCGQ2gVrfRBFtATAP29pp6qArSe8q9ryFOITOod1NBbXxVkk_L2k7aolvWpt5hR_uLLjH-YkXKxCN2YHZVJL6fMOFuwqRkssc0dNUHY5fmMbQVvaYkqHAiKv9pVzjHEuv3pXmPKQQFfiALe-q1tDbpl7HLyw",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://frontend-service-967652754037.asia-east1.run.app",
        "Referer": "https://frontend-service-967652754037.asia-east1.run.app/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    }

    @task
    def login(self):
        # The data to send with the login request (you may need to modify this based on your actual payload)
        data = {
            "email": "tcs449641@gmail.com",
            "password": "mochimochi"
        }
        # Make the POST request to the login endpoint
        self.client.post(self.base_url, json=data, headers=self.headers)

if __name__ == "__main__":
    from locust import run
    run()

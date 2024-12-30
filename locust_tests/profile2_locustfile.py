from locust import HttpUser, task, between
import json

class UserProfileBehavior(HttpUser):
    host = "https://authentication-service-967652754037.asia-east1.run.app"  # Set the host URL
    wait_time = between(1, 2)

    @task
    def get_user_profile(self):
        # Define the Authorization header with the Bearer token
        headers = {
            "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwYTQwNGExYTc4ZmUzNGM5YTVhZGU5NTBhMjE2YzkwYjVkNjMwYjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoibG9jdXN0IHRlc3QiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2xvdWRwcm9qZWN0LWYzM2I3IiwiYXVkIjoiY2xvdWRwcm9qZWN0LWYzM2I3IiwiYXV0aF90aW1lIjoxNzM1NDAwMzA1LCJ1c2VyX2lkIjoiR2NaOFByT0pqdE1JcW1sM0NXN2VPN09TQWpnMSIsInN1YiI6IkdjWjhQck9KanRNSXFtbDNDVzdlTzdPU0FqZzEiLCJpYXQiOjE3MzU0MDM4NTEsImV4cCI6MTczNTQwNzQ1MSwiZW1haWwiOiJsb2N1c3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibG9jdXN0QHRlc3QuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.UVzfeVohJUXAPcGZzf8atrUHU6g9w9d8h6Qx2uqt77w89IQHiEWibZMCNQWuZyfxw2UpTWkaXhlJGJ8QBFspeCA08lwl2MtcGCefcN1ezKsInQvXtN5Kw98cI95RsBKqYGaLo-jBvLH2SPq7eD3g6Jzf99gDGNtSzRrmTsf94UgaVr0FxmgZ9MfYdydVwj9vzwUYxICkOXxasZG2ok3i4oiCt3pUFdn8rKV81p55CIi87YbTD22p78F-j4Vg4cogVB85HijMvXCv6gQBj0ya32niKFIwUXxD7E4sPLd55EtDyGlBxxmnmZ4ehEnnL7g5jI39KPlp8NqssZJq5ikPMA",
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
            "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        }

        response = self.client.get("/api/users/profile", headers=headers)

        # Print the response code and content to debug
        print(f"Response Code: {response.status_code}")
        print(f"Response Content: {response.text}")
        #debug statement
        if response.status_code == 200:
            print("Successfully retrieved user profile")
        else:
            print(f"Failed to retrieve user profile: {response.status_code}")

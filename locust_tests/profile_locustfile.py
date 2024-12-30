from locust import HttpUser, task, between

class ProfileTestUser(HttpUser):
    wait_time = between(1, 3)

    host = "https://authentication-service-967652754037.asia-east1.run.app"
    base_url = "/api/users/profile"
    
    # Headers for the request
    headers = {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwYTQwNGExYTc4ZmUzNGM5YTVhZGU5NTBhMjE2YzkwYjVkNjMwYjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVocmVlbSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jbG91ZHByb2plY3QtZjMzYjciLCJhdWQiOiJjbG91ZHByb2plY3QtZjMzYjciLCJhdXRoX3RpbWUiOjE3MzUzOTI3OTYsInVzZXJfaWQiOiJBVHBEaHE5SERoWDhPZld5cTFaSjdORlphN2UyIiwic3ViIjoiQVRwRGhxOUhEaFg4T2ZXeXExWko3TkZaYTdlMiIsImlhdCI6MTczNTM5NTE2OCwiZXhwIjoxNzM1Mzk4NzY4LCJlbWFpbCI6InRjczQ0OTY0MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGNzNDQ5NjQxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.HxYmAnvVBA1J7n-tM-CqZIvMaVHJoFQSPXuAh81z9kj5OXUcXfTiLFyaywQa49iEHI-uRWc28LXUre47NcLECu8jbVqUxH30MCHaOHjsxhTNaL9rtLOK4FUc56Aer2-vCoSDPS5wEyfoCUgz5bxJ4-sYtStzsOAd0Tii8BTKz_dCsbZnaI_gvDCt26xvagcn_CnHw3SkrbhUHV0by36n7Jh34bkp3UTgDHJWnnqwZST3BCapU0cECiRIIiTT1wzi9Fa08ehcCi5fb0obzSZpt1d0H46SjvmIO-dhIZ5FI842BD4N_x-V65KHlLHqxYFLYlYAF3LVnfUIrTc1ZHwewQ",
            "if-none-match": 'W/"12f-rrtAZJaSAHI46wH6R7kcPEQbJew"',
            "origin": "https://frontend-service-967652754037.asia-east1.run.app",
            "referer": "https://frontend-service-967652754037.asia-east1.run.app/",
            "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
        }

    @task
    def profile_options(self):
        self.client.options(self.base_url, headers=self.headers)


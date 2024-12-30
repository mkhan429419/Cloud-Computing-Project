from locust import HttpUser, task, between

class VideoApiTestUser(HttpUser):
    wait_time = between(1, 5)  # Adjust the wait time
    
    def on_start(self):
        self.token = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3MWI1MTU1MmI0ODA5OWNkMGFkN2Y5YmZlNGViODZiMDM5NmUxZDEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVocmVlbSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jbG91ZHByb2plY3QtZjMzYjciLCJhdWQiOiJjbG91ZHByb2plY3QtZjMzYjciLCJhdXRoX3RpbWUiOjE3MzUzOTI3OTYsInVzZXJfaWQiOiJBVHBEaHE5SERoWDhPZld5cTFaSjdORlphN2UyIiwic3ViIjoiQVRwRGhxOUhEaFg4T2ZXeXExWko3TkZaYTdlMiIsImlhdCI6MTczNTM5NTc5NSwiZXhwIjoxNzM1Mzk5Mzk1LCJlbWFpbCI6InRjczQ0OTY0MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGNzNDQ5NjQxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.OHAXqRGE0FDQXIsd7wd9r8-HEGcYzmt05OM4LVNp36mk-6DtuHoVHYLVshjZbQNjFgyeNAVOuEn80TUBd-zyG_fbHDMoS42NgCX0aNuQVkVoDSzlQZMB8Z68E2VkxgdLUp4lQuhvwnw0PP3FTeADAZz4IX0TEKUvEC7E2r-zDFMia0YJSYE08Ao-ozDQ0eDyodb-DDyRTKoiAMp-11g_F0ZISBceg-5xJzmH30R1FSeqqkM2D_VmLnf5h9FZewoBnTRSyAGlhLXV8BMfIfh6Bv0oKxpZl3RXSRgcRjnsAJiH9LsHgUvQDKaF7ZyzPwTzeEON4OZsxwI9llLqD-6AVA"
        
    @task
    def get_all_videos(self):
        user_id = "ATpDhq9HDhX8OfWyq1ZJ7NFZa7e2"  # obtained user id
        
        headers = {
            "Authorization": self.token,
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-US,en;q=0.9",
            "Origin": "https://frontend-service-967652754037.asia-east1.run.app",
            "Referer": "https://frontend-service-967652754037.asia-east1.run.app/",
            "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "Sec-CH-UA-Mobile": "?1",
            "Sec-CH-UA-Platform": '"Android"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
        }

      
        response = self.client.get(f"/api/storage/{user_id}/videos", headers=headers)

        if response.status_code == 200:
            print("Successfully fetched all videos.")
        else:
            print(f"Failed to fetch videos: {response.status_code}")

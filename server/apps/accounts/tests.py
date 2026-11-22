from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AccountsAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('accounts:register')
        self.login_url = reverse('accounts:login')
        self.refresh_url = reverse('accounts:token_refresh')
        self.me_url = reverse('accounts:me')
        self.logout_url = reverse('accounts:logout')
        
        self.user_data = {
            'email': 'petowner@example.com',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'phone_number': '+1234567890',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'petowner@example.com')
        self.assertEqual(response.data['user']['role'], 'OWNER')

    def test_user_login_and_token_refresh(self):
        # Register user first
        User.objects.create_user(
            email='petowner@example.com',
            password='SecurePassword123!',
            first_name='Jane',
            last_name='Doe'
        )
        
        # Login
        login_response = self.client.post(self.login_url, {
            'email': 'petowner@example.com',
            'password': 'SecurePassword123!'
        }, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        self.assertIn('refresh', login_response.data)

        refresh_token = login_response.data['refresh']

        # Refresh
        refresh_response = self.client.post(self.refresh_url, {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)

    def test_get_and_update_profile(self):
        user = User.objects.create_user(
            email='petowner@example.com',
            password='SecurePassword123!',
            first_name='Jane',
            last_name='Doe'
        )
        self.client.force_authenticate(user=user)

        # GET me
        get_response = self.client.get(self.me_url)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data['email'], 'petowner@example.com')

        # PATCH me
        patch_response = self.client.patch(self.me_url, {
            'phone_number': '+1987654321',
            'profile': {
                'city': 'San Francisco',
                'state': 'CA'
            }
        }, format='json')
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_response.data['phone_number'], '+1987654321')
        self.assertEqual(patch_response.data['profile']['city'], 'San Francisco')

    def test_logout_and_blacklist(self):
        user = User.objects.create_user(
            email='petowner@example.com',
            password='SecurePassword123!'
        )
        login_response = self.client.post(self.login_url, {
            'email': 'petowner@example.com',
            'password': 'SecurePassword123!'
        }, format='json')
        refresh_token = login_response.data['refresh']
        access_token = login_response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = self.client.post(self.logout_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        # Trying to refresh with blacklisted token must fail
        bad_refresh = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(bad_refresh.status_code, status.HTTP_401_UNAUTHORIZED)

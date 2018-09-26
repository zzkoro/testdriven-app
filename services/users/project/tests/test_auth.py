import json
import unittest
import time

from project.tests.base import BaseTestCase
from project.tests.utils import add_user


class TestAuthService(BaseTestCase):
    """Tests for the Auth Service. """

    def test_user_registration(self):
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'juesttest',
                    'email': 'test@test.com',
                    'password': '123456',
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['code'] == 'success')
            self.assertTrue(data['message'] == 'Successfully registered.')
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 201)
            self.assertIn('michael@mherman.org was added!', data['message'])
            self.assertIn('success', data['code'])

    def test_user_registration_duplicate_email(self):
        """Ensure error is thrown if the email already exists."""
        add_user('test', 'test@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'michael',
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                    'Sorry, That user already exists.', data['message'])
            self.assertIn('fail', data['code'])

    def test_user_registration_duplicate_username(self):
        """Ensure error is thrown if the username already exists."""
        add_user('test', 'test@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'test',
                    'email': 'test@test.com2',
                    'password': 'test'
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                    'Sorry, That user already exists.', data['message'])
            self.assertIn('fail', data['code'])

    def test_user_registration_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty"""
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({}),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['code'])


    def test_user_registration_invalid_json_keys_no_username(self):
        """Ensure error is thrown if the JSON object does not have a username key."""
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps(
                        {
                            'email': 'test@test.com',
                            'password': 'test',
                        }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['code'])

    def test_user_registration_invalid_json_keys_no_email(self):
        """Ensure error is thrown if the JSON object does not have a email key."""
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps(
                        {
                            'username': 'justtest',
                            'password': 'test',
                        }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['code'])

    def test_user_registration_invalid_json_keys_no_password(self):
        """Ensure error is thrown if the JSON object does not have a password key."""
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps(
                    {
                        'username': 'justtest',
                        'email': 'test@test.com',
                    }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['code'])

    def test_registered_user_login(self):
        add_user('test', 'test@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['code'] == 'success')
            self.assertTrue(data['message'] == 'Successfully logged in.')
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 200)

    def test_not_registered_user_login(self):

        with self.client:
            response = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['code'] == 'fail')
            self.assertTrue(data['message'] == 'User does not exist.')
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 404)

    def test_valid_logout(self):
        add_user('test', 'test@test.com', 'test')
        with self.client:
            # user login
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json',
            )
            # valid token logout
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['code'] == 'success')
            self.assertTrue(data['message'] == 'Successfully logged out.')
            self.assertEqual(response.status_code, 200)

    def test_invalid_logout_expired_token(self):
        add_user('test', 'test@test.com', 'test')
        with self.client:
            # user login
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json',
            )
            # invalid token logout
            time.sleep(4)
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['code'] == 'fail')
            self.assertTrue(
                data['message'] == 'Signature expired. Please log in again.')
            self.assertEqual(response.status_code, 401)

    def test_invalid_logout(self):
        with  self.client:
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': 'Bearer invalid'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue((data['code'] == 'fail'))
            self.assertTrue(
                data['message'] == 'Invalid token. Please log in again.'
            )
            self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
